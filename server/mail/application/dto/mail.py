from typing import *
from pydantic import *

EmailType = NameEmail | EmailStr


class MailSendDtoIn(BaseModel):
    sender: Optional[EmailType]
    to: List[EmailType]
    subject: str

    text: Optional[str]
    html: Optional[str]

    template_name: Optional[str] = Field(alias='templateName')
    template_context: Dict[str, Any] = Field(default_factory=dict, alias='templateContext')

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
