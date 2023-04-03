from typing import *
from pydantic import *


class MailGunDtoIn(BaseModel):
    sender: EmailStr
    to: List[EmailStr]
    subject: str

    text: Optional[str]
    html: Optional[str]
