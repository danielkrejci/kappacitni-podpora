import config
import socket
from typing import *
from smtplib import SMTP, SMTPException
from fastapi import HTTPException, status
from application.dto.mail_smtp import SMTPUserDto
from application.dto.mail import MailSendDtoIn, MailSendDtoOut
from application.abl.mail import render_email_template, text_from_html

from pydantic import parse_file_as
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

smtp_users_path = config.resources_path / 'smtp_users.json'


def get_smtp_user(username: str) -> Optional[SMTPUserDto]:  # Get correct smtp user
    users: List[SMTPUserDto] = parse_file_as(List[SMTPUserDto], smtp_users_path)
    return next(filter(lambda u: u.username == username, users), None)


def create_smtp(username: str) -> SMTP:  # Create SMTP object and login
    smtp_user = get_smtp_user(username)

    if not smtp_user:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, f'Unknown SMTP sender {username}.')

    try:  # Connect or error
        smtp = SMTP(host=smtp_user.host, port=smtp_user.port)
    except (SMTPException, socket.gaierror):
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, f'Invalid SMTP server configuration for user {username}.')

    try:  # Login or error
        smtp.login(smtp_user.username, smtp_user.password)
    except SMTPException:
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, f'Invalid credentials for user {username}')

    return smtp


async def send_mail(dto_in: MailSendDtoIn) -> MailSendDtoOut:
    """ Send mail using SMTP API """

    if dto_in.template_name:  # Render template if template name specified
        dto_in.html = render_email_template(dto_in.template_name, dto_in.template_context)

    # Self-explanatory error handling
    if not any((dto_in.text, dto_in.html, dto_in.template_name)):
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            'At least one of text, body or template_name must be specified.'
        )

    if not dto_in.text:  # Set text attribute from parsed html
        dto_in.text = text_from_html(dto_in.html)

    smtp = create_smtp(dto_in.sender)  # Get SMTP

    message = MIMEMultipart()  # Create SMTP message
    message['From'] = dto_in.sender
    message['To'] = dto_in.to
    message['Subject'] = dto_in.subject

    if dto_in.text:  # Attach body parts
        message.attach(MIMEText(dto_in.text, 'plain'))
    if dto_in.html:
        message.attach(MIMEText(dto_in.html, 'html'))

    response_data = dict()  # Send and make response
    try:
        result = smtp.sendmail(dto_in.sender, dto_in.to, message.as_string())  # Send it!
        response_data['status'] = 'success'
        response_data['message'] = f'OK or partially ok: {result}'
    except SMTPException as exc:
        response_data['status'] = 'fail'
        response_data['message'] = str(exc)
    finally:
        smtp.quit()

    return MailSendDtoOut.parse_obj(response_data)  # Dto out
