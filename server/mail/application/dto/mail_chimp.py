from typing import *
from pydantic import *
from application.dto.mail import EmailType


class MailChipToDtoIn(BaseModel):
    email: EmailType
    name: Optional[str]


class MailChimpDtoIn(BaseModel):
    html: Optional[str]
    text: Optional[str]
    subject: str
    from_email: EmailType
    from_name: Optional[str]
    to: List[MailChipToDtoIn]
