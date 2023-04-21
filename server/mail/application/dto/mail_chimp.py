from typing import *
from pydantic import *


class MailChipToDtoIn(BaseModel):
    email: EmailStr
    name: Optional[str]


class MailChimpDtoIn(BaseModel):
    html: Optional[str]
    text: Optional[str]
    subject: str
    from_email: EmailStr
    from_name: Optional[str]
    to: List[MailChipToDtoIn]
