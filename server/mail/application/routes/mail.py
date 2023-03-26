from application.app import app
from application.abl import mail_gun
from application.dto.mail import MailSendDtoIn, MailSendDtoOut


@app.router.post(
    '/mail/send', response_model=MailSendDtoOut,
    tags=['send_mail'],
    description='Send email using MailGun API. ',
)
async def mail_send(dto_in: MailSendDtoIn) -> MailSendDtoOut:
    return await mail_gun.send_mail(dto_in)
