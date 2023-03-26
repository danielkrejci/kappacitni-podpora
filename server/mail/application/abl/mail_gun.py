import config
import html5lib
from typing import *
from datetime import datetime
from bs4 import BeautifulSoup
from fastapi import HTTPException
from application.app import templates
from application.abl.http_client import get_async_session
from application.dto.mail import MailSendDtoIn, MailSendDtoOut


def get_mail_gun_session():
    """ Get http session with MailGun auth """
    session = get_async_session(timeout=10)
    session.auth = config.mail_gun_auth
    return session


def render_email_template(template_name: str, template_context: Dict[str, Any]) -> str:
    """ Render email html """
    template = templates.env.get_template(template_name)  # Get template from templates environment
    context = dict(  # Context defaults
        now_utc=datetime.utcnow(),
        now=datetime.now()
    )
    context.update(template_context)  # Client defined context
    return template.render(**context)  # Render with context


def text_from_html(html_str: str) -> str:
    """ Extract text from html """
    return BeautifulSoup(html_str, html5lib.__name__).text


async def send_mail(dto: MailSendDtoIn) -> MailSendDtoOut:
    """ Send mail using MailGun API """
    session = get_mail_gun_session()
    request_data = dto.dict()

    # Since from is python keyword, sender is used in dto
    request_data['from'] = request_data.pop('sender')

    if dto.template_name:  # Render template if template name specified
        request_data['body'] = render_email_template(dto.template_name, dto.template_context)

    if not any((request_data.get('text'), request_data.get('body'))):  # Self-explanatory error handling
        raise HTTPException(400, 'At least one of text, body or template_name must be specified.')

    if not request_data.get('text'):  # Set text attribute from parsed html
        request_data['text'] = text_from_html(request_data['body'])

    response = await session.post(  # Make request
        f'https://api.mailgun.net/v3/{config.mail_gun_sandbox}/messages',
        data=request_data
    )

    response_data: dict = response.json()  # Response data
    response_data['status'] = 'success' if 'id' in response_data.keys() else 'fail'  # Define status

    return MailSendDtoOut.parse_obj(response_data)  # Dto out
