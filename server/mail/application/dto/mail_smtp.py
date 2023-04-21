from pydantic import *


class SMTPUserDto(BaseModel):
    username: EmailStr
    password: str
    host: str | IPvAnyAddress
    port: int = 2525
