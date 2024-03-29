import config
from typing import List
from fastapi import HTTPException, status
from application.abl.http_client import get_async_session
from application.dto.mail import MailSendDtoIn, MailSendDtoOut
from application.dto.mail_chimp import MailChipToDtoIn, MailChimpDtoIn
from application.abl.mail import render_email_template, text_from_html


async def send_mail(dto: MailSendDtoIn) -> MailSendDtoOut:
    """ Send mail using MailChimp API """
    request_data = dto.dict()

    # Data transform
    request_data['from_email'] = dto.sender or config.default_sender
    request_data['from_name'] = dto.sender or config.default_sender
    request_data['to'] = [MailChipToDtoIn(email=mail.email, name=mail.name or mail.email) for mail in dto.to]

    if dto.template_name:  # Render template if template name specified
        request_data['html'] = render_email_template(dto.template_name, dto.template_context)

    # Self-explanatory error handling
    if not any((request_data.get('text'), request_data.get('html'), request_data.get('template_name'))):
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            'At least one of text, body or template_name must be specified.'
        )

    if not request_data.get('text'):  # Set text attribute from parsed html
        request_data['text'] = text_from_html(request_data['html'])

    session = get_async_session()
    response = await session.post(  # Send it!
        'https://mandrillapp.com/api/1.0/messages/send',
        json={
            'key': config.mail_chimp_api_key,
            'message': MailChimpDtoIn.parse_obj(request_data).dict()
        }
    )

    response_data: List[dict] = response.json()  # Response data
    response_data: dict = response_data[0]

    # Define status
    if response_data['status'] == 'sent':
        response_data['status'] = 'success'
    else:
        response_data['status'] = 'fail'
    response_data['message'] = response_data.get('message') or response_data['status'].title()

    return MailSendDtoOut.parse_obj(response_data)  # Dto out
