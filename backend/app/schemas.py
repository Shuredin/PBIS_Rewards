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