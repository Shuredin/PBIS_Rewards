from pydantic import BaseModel


class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: str
    role: str


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