from sqlalchemy import Column, Integer, String, ForeignKey, Float, Boolean, DateTime
from datetime import datetime
from .database import Base
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    google_id = Column(String, unique=True, nullable=True)
    first_name = Column(String)
    last_name = Column(String)
    email = Column(String, unique=True)
    role = Column(String)
    points = Column(Integer, default=0)
    attendance_rate = Column(Float, default=100)
    behavior_referrals = Column(Integer, default=0)
    rewards_received = Column(Integer, default=0)


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    amount = Column(Integer)
    reason = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class Class(Base):
    __tablename__ = "classes"
    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    teacher_id = Column(
        Integer,
        ForeignKey("users.id")
       )


class ClassStudent(Base):
    __tablename__ = "class_students"

    id = Column(Integer, primary_key=True, index=True)

    class_id = Column(
        Integer,
        ForeignKey("classes.id")
    )

    student_id = Column(
        Integer,
        ForeignKey("users.id")
    )


class RewardItem(Base):

    __tablename__ = "reward_items"


    id = Column(
        Integer,
        primary_key=True,
        index=True
    )


    teacher_id = Column(
        Integer,
        nullable=False
    )


    name = Column(
        String,
        nullable=False
    )


    description = Column(
        String
    )


    cost = Column(
        Integer,
        nullable=False
    )


    active = Column(
        Boolean,
        default=True
    )


class PurchaseRequest(Base):

    __tablename__ = "purchase_requests"


    id = Column(
        Integer,
        primary_key=True,
        index=True
    )


    student_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )


    reward_item_id = Column(
        Integer,
        ForeignKey("reward_items.id"),
        nullable=False
    )


    status = Column(
        String,
        default="Pending"
    )


    requested_date = Column(
        DateTime,
        default=datetime.utcnow
    )


    student = relationship(
        "User"
    )


    reward_item = relationship(
        "RewardItem"
    )