from sqlalchemy import Column, Integer, String
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    google_id = Column(String, unique=True, nullable=True)
    first_name = Column(String)
    last_name = Column(String)
    email = Column(String, unique=True)
    role = Column(String)
    points = Column(Integer, default=0)

    class Transaction(Base):
        __tablename__ = "transactions"

        id = Column(Integer, primary_key=True, index=True)
        user_id = Column(Integer)
        amount = Column(Integer)
        reason = Column(String)