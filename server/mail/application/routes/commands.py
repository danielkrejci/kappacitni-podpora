import config
from application.app import app
from fastapi import HTTPException, status
from application.auth import UserDto, AuthDepends
from application.abl import mail_gun, mail_chimp, mail_smtp
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


@app.post(
    '/smtp/send', response_model=MailSendDtoOut,
    tags=['SMTP'],
    description='Send email using SMTP protocol. ',
)
async def mail_smtp_send(dto_in: MailSendDtoIn, user: UserDto = AuthDepends) -> MailSendDtoOut:
    return await mail_smtp.send_mail(dto_in)


@app.post(
    '/default/send', response_model=MailSendDtoOut,
    tags=['Default configured'],
    description='Send email using method described in config. ',
)
async def mail_default_send(dto_in: MailSendDtoIn, user: UserDto = AuthDepends) -> MailSendDtoOut:
    send_methods = dict(
        smtp=mail_smtp.send_mail,
        mailchimp=mail_chimp.send_mail,
        mailgun=mail_gun.send_mail
    )
    if config.default_send_method not in send_methods.keys():
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, 'Invalid default_send_method configuration.')
    return await (send_methods[config.default_send_method](dto_in))
