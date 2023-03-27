from typing import *
from pydantic import *


class MailSendDtoIn(BaseModel):
    sender: Optional[EmailStr]
    to: List[EmailStr]
    subject: str

    text: Optional[str]
    html: Optional[str]

    template_name: Optional[str]
    template_context: Dict[str, Any] = Field(default_factory=dict)

    @classmethod
    @root_validator
    def check_at_least_one_given(cls, values: Dict[str, Any]):
        """ Validate "content" attributes """
        if not any((values.get('text'), values.get('body'), values.get('template_name'))):
            raise ValueError('At least one of text, body or template_name must be specified.')
        return values


class MailSendDtoOut(BaseModel):
    status: Literal['success', 'fail']
    message: str

    class Config:
        extra = 'allow'
