from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from .database import engine, Base, SessionLocal
from . import models, schemas

from .ml_model import predict_reinforcement
from fastapi.middleware.cors import CORSMiddleware

from datetime import datetime, timedelta

from sqlalchemy.orm import joinedload

from sqlalchemy import text

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def home():
    return {
        "message": "system is running"
    }


@app.post("/users")
def create_user(
    user: schemas.UserCreate,
    db: Session = Depends(get_db)
):
    new_user = models.User(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        role=user.role,
        attendance_rate=user.attendance_rate,
        behavior_referrals=user.behavior_referrals,
        rewards_received=user.rewards_received
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

@app.get("/users")
def get_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()


@app.post("/classes")
def create_class(
    class_data: schemas.ClassCreate,
    db: Session = Depends(get_db)
):

    new_class = models.Class(
        name=class_data.name,
        teacher_id=class_data.teacher_id
    )

    db.add(new_class)
    db.commit()
    db.refresh(new_class)

    return new_class

@app.get("/teachers/{teacher_id}/classes")
def get_teacher_classes(
    teacher_id: int,
    db: Session = Depends(get_db)
):

    classes = db.query(models.Class).filter(
        models.Class.teacher_id == teacher_id
    ).all()

    return classes


@app.post("/classes/{class_id}/students")
def add_student_to_class(
    class_id: int,
    student: schemas.ClassStudentCreate,
    db: Session = Depends(get_db)
):

    existing = db.query(models.ClassStudent).filter(
        models.ClassStudent.class_id == class_id,
        models.ClassStudent.student_id == student.student_id
    ).first()

    if existing:
        return {
            "error": "Student is already in this class"
        }

    class_student = models.ClassStudent(
        class_id=class_id,
        student_id=student.student_id
    )

    db.add(class_student)
    db.commit()
    db.refresh(class_student)

    return class_student


@app.delete("/classes/{class_id}/students/{student_id}")
def remove_student_from_class(
    class_id: int,
    student_id: int,
    db: Session = Depends(get_db)
):

    class_student = db.query(
        models.ClassStudent
    ).filter(
        models.ClassStudent.class_id == class_id,
        models.ClassStudent.student_id == student_id
    ).first()

    if not class_student:
        return {
            "error": "Student is not in this class"
        }

    db.delete(class_student)
    db.commit()

    return {
        "message": "Student removed from class"
    }


@app.get("/classes/{class_id}/students")
def get_class_students(
    class_id: int,
    db: Session = Depends(get_db)
):

    class_students = db.query(models.ClassStudent).filter(
        models.ClassStudent.class_id == class_id
    ).all()

    students = []

    for class_student in class_students:

        student = db.query(models.User).filter(
            models.User.id == class_student.student_id
        ).first()

        if student:

            rewards_this_week = db.query(models.Transaction).filter(
                models.Transaction.user_id == student.id,
                models.Transaction.created_at >= datetime.utcnow() - timedelta(days=7)
            ).all()

            weekly_points = sum(
                reward.amount for reward in rewards_this_week
            )

            prediction = predict_reinforcement(
                rewards_this_week=student.rewards_received,
                attendance_rate=student.attendance_rate,
                behavior_referrals=student.behavior_referrals
            )

            students.append({

                "id": student.id,
                "first_name": student.first_name,
                "last_name": student.last_name,
                "points": student.points,
                "weekly_points": weekly_points,
                "attendance_rate": student.attendance_rate,
                "behavior_referrals": student.behavior_referrals,
                "needs_reinforcement":
                    prediction["prediction"] == "Needs Reinforcement",
                "prediction":
                    prediction["prediction"],
                "confidence":
                    prediction["confidence"]
            })

    return students


@app.get("/classes/{class_id}/available-students")
def get_available_students(
    class_id: int,
    db: Session = Depends(get_db)
):

    existing_student_ids = db.query(
        models.ClassStudent.student_id
    ).filter(
        models.ClassStudent.class_id == class_id
    ).all()

    existing_student_ids = [
        student_id[0]
        for student_id in existing_student_ids
    ]

    students = db.query(models.User).filter(
        models.User.role == "student"
    )

    if existing_student_ids:
        students = students.filter(
            ~models.User.id.in_(existing_student_ids)
        )

    return students.all()


@app.get("/school/students")
def get_all_school_students(
    db: Session = Depends(get_db)
):

    students = db.query(models.User).filter(
        models.User.role == "student"
    ).all()

    student_list = []

    for student in students:

        weekly_transactions = db.query(
            models.Transaction
        ).filter(

            models.Transaction.user_id == student.id,
            models.Transaction.created_at >= datetime.utcnow() - timedelta(days=7)

        ).all()

        weekly_points = sum(
            transaction.amount
            for transaction in weekly_transactions
        )

        prediction = predict_reinforcement(

            rewards_this_week=weekly_points,
            attendance_rate=student.attendance_rate,
            behavior_referrals=student.behavior_referrals

        )



        student_list.append({

            "id": student.id,
            "first_name": student.first_name,
            "last_name": student.last_name,
            "points": student.points,
            "weekly_points": weekly_points,
            "attendance_rate": student.attendance_rate,
            "behavior_referrals": student.behavior_referrals,
            "needs_reinforcement":
                prediction["prediction"] == "Needs Reinforcement",
            "prediction":
                prediction["prediction"],
            "confidence":
                prediction["confidence"]

        })


    return student_list


@app.post("/reward")
def give_reward(
    reward: schemas.RewardCreate,
    db: Session = Depends(get_db)
):
    student = (
        db.query(models.User)
        .filter(
            models.User.id == reward.student_id
        )
        .first()
    )

    if not student:
        return {
            "error": "Student not found"
        }

    teacher = (
        db.query(models.User)
        .filter(
            models.User.id == reward.teacher_id
        )
        .first()
    )

    if not teacher:
        return {
            "error": "Teacher not found"
        }

    student.points += reward.amount
    student.rewards_received += 1

    transaction = models.Transaction(
        user_id=student.id,
        amount=reward.amount,
        reason=reward.reason,
        awarded_by=teacher.id
    )

    db.add(transaction)
    db.commit()
    db.refresh(student)

    return {
        "message": "Points awarded",
        "student": student.first_name,
        "new_points": student.points
    }


@app.get("/transactions")
def get_transactions(db: Session = Depends(get_db)):
    return db.query(models.Transaction).all()

@app.get("/students")
def get_students(db: Session = Depends(get_db)):
    students = db.query(models.User).filter(
        models.User.role == "student"
    ).all()

    return students


@app.get("/students/recommendations")
def get_recommendations(
    db: Session = Depends(get_db)
):
    students = db.query(models.User).filter(
        models.User.role == "student"
    ).all()

    recommendations = []

    for student in students:

        rewards = db.query(models.Transaction).filter(
            models.Transaction.user_id == student.id
        ).count()

        result = predict_reinforcement(
            rewards_this_week=rewards,
            attendance_rate=student.attendance_rate,
            behavior_referrals=student.behavior_referrals
        )

        recommendations.append({
            "id": student.id,
            "name": f"{student.first_name} {student.last_name}",
            "points": student.points,
            "attendance_rate": student.attendance_rate,
            "behavior_referrals": student.behavior_referrals,
            "prediction": result
        })

    recommendations.sort(
        key=lambda x: x["prediction"]["needs_reinforcement"],
        reverse=True
    )

    return recommendations

@app.get("/students/{student_id}")
def get_student(
    student_id: int,
    db: Session = Depends(get_db)
):
    student = db.query(models.User).filter(
        models.User.id == student_id
    ).first()

    if not student:
        return {"error": "Student not found"}

    transactions = db.query(models.Transaction).filter(
        models.Transaction.user_id == student_id
    ).order_by(
        models.Transaction.created_at.desc()
    ).all()

    transaction_history = []

    for transaction in transactions:

        awarded_by = None
        store_name = None

        if transaction.awarded_by:
            teacher = db.query(models.User).filter(
                models.User.id == transaction.awarded_by
            ).first()

            if teacher:
                awarded_by = (
                    f"{teacher.first_name} {teacher.last_name}"
                )

        if transaction.store_id:
            store = db.query(models.Store).filter(
                models.Store.id == transaction.store_id
            ).first()

            if store:
                store_name = store.name

        transaction_history.append({
            "id": transaction.id,
            "amount": transaction.amount,
            "reason": transaction.reason,
            "created_at": transaction.created_at,
            "awarded_by": awarded_by,
            "store": store_name
        })

    return {
        "student": student,
        "transactions": transaction_history
    }

@app.get("/students/{student_id}/reinforcement")
def check_reinforcement(
    student_id: int,
    db: Session = Depends(get_db)
):

    student = db.query(models.User).filter(
        models.User.id == student_id
    ).first()

    if not student:
        return {"error": "Student not found"}

    one_week_ago = datetime.utcnow() - timedelta(days=7)

    weekly_points = 0

    transactions = db.query(models.Transaction).filter(
        models.Transaction.user_id == student_id,
        models.Transaction.created_at >= one_week_ago
    ).all()

    for transaction in transactions:
        weekly_points += transaction.amount

    result = predict_reinforcement(
        rewards_this_week=weekly_points,
        attendance_rate=student.attendance_rate,
        behavior_referrals=student.behavior_referrals
    )

    return {
        "student": student.first_name,
        "weekly_points": weekly_points,
        "attendance_rate": student.attendance_rate,
        "behavior_referrals": student.behavior_referrals,
        **result
    }

@app.get("/storefront/items")
def get_store_items(
    db: Session = Depends(get_db)
):

    teacher_id = 3

    store = db.query(
        models.Store
    ).filter(
        models.Store.teacher_id == teacher_id,
        models.Store.active == True
    ).first()

    if not store:
        return {
            "error": "No store assigned to this teacher"
        }

    return db.query(
        models.RewardItem
    ).filter(
        models.RewardItem.store_id == store.id,
        models.RewardItem.active == True
    ).all()


@app.post("/storefront/items")
def create_store_item(
    item: schemas.RewardItemCreate,
    db: Session = Depends(get_db)
):

    teacher_id = 3

    store = db.query(
        models.Store
    ).filter(
        models.Store.teacher_id == teacher_id,
        models.Store.active == True
    ).first()

    if not store:
        return {
            "error": "No store assigned to this teacher"
        }

    new_item = models.RewardItem(
        name=item.name,
        description=item.description,
        cost=item.cost,
        teacher_id=teacher_id,
        store_id=store.id
    )

    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    return new_item


@app.put("/storefront/items/{item_id}")
def update_store_item(
    item_id: int,
    item: schemas.RewardItemCreate,
    db: Session = Depends(get_db)
):

    teacher_id = 3

    store = db.query(
        models.Store
    ).filter(
        models.Store.teacher_id == teacher_id,
        models.Store.active == True
    ).first()

    if not store:
        return {
            "error": "No store assigned to this teacher"
        }

    store_item = db.query(
        models.RewardItem
    ).filter(
        models.RewardItem.id == item_id,
        models.RewardItem.store_id == store.id
    ).first()

    if not store_item:
        return {
            "error": "Reward item not found in your store"
        }

    store_item.name = item.name
    store_item.description = item.description
    store_item.cost = item.cost

    db.commit()
    db.refresh(store_item)

    return store_item

@app.delete("/storefront/items/{item_id}")
def delete_store_item(
    item_id: int,
    db: Session = Depends(get_db)
):

    teacher_id = 3

    store = db.query(
        models.Store
    ).filter(
        models.Store.teacher_id == teacher_id,
        models.Store.active == True
    ).first()

    if not store:
        return {
            "error": "No store assigned to this teacher"
        }

    store_item = db.query(
        models.RewardItem
    ).filter(
        models.RewardItem.id == item_id,
        models.RewardItem.store_id == store.id
    ).first()

    if not store_item:
        return {
            "error": "Reward item not found in your store"
        }

    store_item.active = False

    db.commit()

    return {
        "message": "Item removed"
    }


@app.post("/purchase-request")
def create_purchase_request(
    request: schemas.PurchaseRequestCreate,
    db: Session = Depends(get_db)
):

    purchase_request = models.PurchaseRequest(
        student_id=request.student_id,
        reward_item_id=request.reward_item_id
    )

    db.add(purchase_request)
    db.commit()
    db.refresh(purchase_request)

    return purchase_request


@app.get("/purchase-requests")
def get_purchase_requests(
    db: Session = Depends(get_db)
):

    requests = (
        db.query(models.PurchaseRequest)
        .options(
            joinedload(models.PurchaseRequest.student),
            joinedload(models.PurchaseRequest.reward_item)
        )
        .all()
    )

    return requests


@app.put("/purchase-requests/{request_id}")
def update_purchase_request(
    request_id: int,
    status: str,
    db: Session = Depends(get_db)
):

    purchase_request = (
        db.query(models.PurchaseRequest)
        .filter(
            models.PurchaseRequest.id == request_id
        )
        .first()
    )

    if not purchase_request:
        return {
            "error": "Request not found"
        }

    if status not in ["Approved", "Denied"]:
        return {
            "error": "Invalid status"
        }

    if purchase_request.status != "Pending":
        return {
            "error": "This request has already been processed"
        }

    if status == "Approved":

        student = (
            db.query(models.User)
            .filter(
                models.User.id == purchase_request.student_id
            )
            .first()
        )

        reward_item = (
            db.query(models.RewardItem)
            .filter(
                models.RewardItem.id == purchase_request.reward_item_id
            )
            .first()
        )

        if not student or not reward_item:
            return {
                "error": "Student or reward not found"
            }

        if student.points < reward_item.cost:
            return {
                "error": "Student does not have enough points"
            }

        student.points -= reward_item.cost

        transaction = models.Transaction(
            user_id=student.id,
            amount=-reward_item.cost,
            reason=f"Purchased: {reward_item.name}",
            store_id=reward_item.store_id
        )

        db.add(transaction)

    purchase_request.status = status

    db.commit()

    db.refresh(purchase_request)

    return {
        "id": purchase_request.id,
        "status": purchase_request.status,
        "message": f"Purchase request {status.lower()}"
    }


@app.get("/stores", response_model=list[schemas.Store])
def get_stores(db: Session = Depends(get_db)):

    return db.query(models.Store).filter(
        models.Store.active == True
    ).all()


@app.get("/teacher/store")
def get_teacher_store(
    db: Session = Depends(get_db)
):
    teacher_id = 3

    store = db.query(models.Store).filter(
        models.Store.teacher_id == teacher_id,
        models.Store.active == True
    ).first()

    if not store:
        return {
            "error": "No store assigned to this teacher"
        }

    return store


@app.post("/stores", response_model=schemas.Store)
def create_store(
    store: schemas.StoreBase,
    db: Session = Depends(get_db)
):

    teacher_id = 3

    teacher = db.query(models.User).filter(
        models.User.id == teacher_id,
        models.User.role == "teacher"
    ).first()

    if not teacher:
        return {
            "error": "Teacher not found"
        }

    new_store = models.Store(
        name=store.name,
        description=store.description,
        teacher_id=teacher_id
    )

    db.add(new_store)
    db.commit()
    db.refresh(new_store)

    return new_store


@app.put("/stores/{store_id}/delete")
def delete_store(
    store_id: int,
    db: Session = Depends(get_db)
):

    store = db.query(models.Store).filter(
        models.Store.id == store_id
    ).first()

    if not store:

        return {"error": "Store not found"}

    store.active = False

    db.commit()

    return {"message": "Store deleted"}


@app.get("/stores/{store_id}/items")
def get_store_items(
    store_id: int,
    db: Session = Depends(get_db)
):

    items = db.query(
        models.RewardItem
    ).filter(
        models.RewardItem.store_id == store_id,
        models.RewardItem.active == True
    ).all()

    return items