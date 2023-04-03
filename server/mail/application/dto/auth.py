from typing import *
from pydantic import *


class UserDto(BaseModel):
    username: str
    roles: List[str] = Field(default_factory=list)
