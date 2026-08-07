from pydantic import BaseModel


class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: str
    role: str
    attendance_rate: float = 100
    behavior_referrals: int = 0
    rewards_received: int = 0


class UserResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    role: str
    balance: int

    class Config:
        from_attributes = True


class RewardCreate(BaseModel):
    student_id: int
    amount: int
    reason: str


from typing import Optional


class ClassCreate(BaseModel):
    name: str
    teacher_id: int


class ClassStudentCreate(BaseModel):
    student_id: int


class RewardItemCreate(BaseModel):

    name: str

    description: str

    cost: int


class PurchaseRequestCreate(BaseModel):

    student_id: int

    reward_item_id: int


class PurchaseRequestResponse(BaseModel):

    id: int

    student_id: int

    reward_item_id: int

    status: str

    class Config:
        from_attributes = True