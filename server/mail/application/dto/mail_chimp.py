from typing import *
from pydantic import *


class MailChipToDtoIn(BaseModel):
    email: EmailStr
    name: Optional[str]


class MailChimpDtoIn(BaseModel):
    html: str
    text: str
    subject: str
    from_email: EmailStr
    from_name: Optional[str]
    to: List[MailChipToDtoIn]
