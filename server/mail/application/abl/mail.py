import config
import jinja2
import html5lib
from typing import *
from datetime import datetime
from bs4 import BeautifulSoup
from fastapi import HTTPException, status

from application.app import templates


def render_email_template(template_name: str, template_context: Dict[str, Any]) -> str:
    """ Render email html """
    try:  # Get template from templates environment, if template exists
        template_full_path = next(config.templates_path.glob(f'{template_name}*'), None)
        if not template_full_path:
            raise jinja2.TemplateNotFound(template_name)
        template_name = str(template_full_path.relative_to(config.templates_path))

        template = templates.env.get_template(template_name)
    except jinja2.TemplateNotFound:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, 'Template not found.')

    context = dict(  # Context defaults
        now_utc=datetime.utcnow(),
        now=datetime.now()
    )
    context.update(template_context)  # Client defined context
    try:
        return template.render(**context)  # Render with context
    except jinja2.TemplateError:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, 'Error while rendering a template.')


def text_from_html(html_str: str) -> str:
    """ Extract text from html (text part of mail) """
    return BeautifulSoup(html_str, html5lib.__name__).text
