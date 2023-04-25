from pydantic import *
from application.dto.mail import EmailType


class SMTPUserDto(BaseModel):
    username: EmailType
    password: str
    host: str | IPvAnyAddress
    port: int = 25
