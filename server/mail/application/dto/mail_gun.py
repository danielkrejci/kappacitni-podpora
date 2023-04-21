from typing import *
from pydantic import *
from application.dto.mail import EmailType


class MailGunDtoIn(BaseModel):
    from_: EmailType
    to: List[EmailType]
    subject: str

    text: Optional[str]
    html: Optional[str]
