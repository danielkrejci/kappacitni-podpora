from application.app import app
from application.auth import UserDto, AuthDepends
from application.abl import mail_gun, mail_chimp
from application.dto.mail import MailSendDtoIn, MailSendDtoOut


@app.post(
    '/mailgun/send', response_model=MailSendDtoOut,
    tags=['MailGun'],
    description='Send email using MailGun API. ',
)
async def mail_gun_send(dto_in: MailSendDtoIn, user: UserDto = AuthDepends) -> MailSendDtoOut:
    return await mail_gun.send_mail(dto_in)


@app.post(
    '/mailchimp/send', response_model=MailSendDtoOut,
    tags=['MailChimp'],
    description='Send email using MailChimp API. ',
)
async def mail_chimp_send(dto_in: MailSendDtoIn, user: UserDto = AuthDepends) -> MailSendDtoOut:
    return await mail_chimp.send_mail(dto_in)
