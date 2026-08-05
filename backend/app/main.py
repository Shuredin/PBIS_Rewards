from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from .database import engine, Base, SessionLocal
from . import models, schemas

from .ml_model import predict_reinforcement
from fastapi.middleware.cors import CORSMiddleware


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
        "message": "PBIS Rewards Backend is running!"
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

@app.post("/reward")
def give_reward(
    reward: schemas.RewardCreate,
    db: Session = Depends(get_db)
):
    student = db.query(models.User).filter(
        models.User.id == reward.student_id
    ).first()

    if not student:
        return {"error": "Student not found"}

    student.points += reward.amount
    student.rewards_received += 1

    transaction = models.Transaction(
        user_id=reward.student_id,
        amount=reward.amount,
        reason=reward.reason
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
            points=student.points,
            rewards_this_month=rewards,
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
    ).all()

    return {
        "student": student,
        "transactions": transactions
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


    rewards = db.query(models.Transaction).filter(
        models.Transaction.user_id == student_id
    ).count()


    result = predict_reinforcement(
        points=student.points,
        rewards_this_month=student.rewards_received,
        attendance_rate=student.attendance_rate,
        behavior_referrals=student.behavior_referrals
    )


    return {
        "student": student.first_name,
        **result
    }
