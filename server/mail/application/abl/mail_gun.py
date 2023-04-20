import config
from fastapi import HTTPException
from application.abl.http_client import get_async_session
from application.dto.mail import MailSendDtoIn, MailSendDtoOut
from application.abl.mail import render_email_template, text_from_html
from application.dto.mail_gun import MailGunDtoIn


def get_mail_gun_session():
    """ Get http session with MailGun auth """
    session = get_async_session(timeout=10)
    session.auth = config.mail_gun_auth
    return session


async def send_mail(dto: MailSendDtoIn) -> MailSendDtoOut:
    """ Send mail using MailGun API """
    session = get_mail_gun_session()
    request_data = dto.dict()

    # Data transform
    request_data['from'] = dto.sender or config.mail_gun_default_sender

    if dto.template_name:  # Render template if template name specified
        request_data['html'] = render_email_template(dto.template_name, dto.template_context)

    # Self-explanatory error handling
    if not any((request_data.get('text'), request_data.get('html'), request_data.get('template_name'))):
        raise HTTPException(400, 'At least one of text, body or template_name must be specified.')

    if not request_data.get('text'):  # Set text attribute from parsed html
        request_data['text'] = text_from_html(request_data['html'])

    response = await session.post(  # Make request
        f'https://api.mailgun.net/v3/{config.mail_gun_sandbox}/messages',
        data=MailGunDtoIn.parse_obj(request_data).dict()
    )
    response_data: dict = response.json()  # Response data

    # Define status
    response_data['status'] = 'success' if 'id' in response_data.keys() else 'fail'

    return MailSendDtoOut.parse_obj(response_data)  # Dto out
