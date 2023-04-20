import jinja2
import html5lib
from typing import *
from datetime import datetime
from bs4 import BeautifulSoup
from fastapi import HTTPException

from application.app import templates


def render_email_template(template_name: str, template_context: Dict[str, Any]) -> str:
    """ Render email html """
    try:  # Get template from templates environment, if template exists
        template = templates.env.get_template(template_name)
    except jinja2.TemplateNotFound:
        raise HTTPException(400, 'Template not found.')

    context = dict(  # Context defaults
        now_utc=datetime.utcnow(),
        now=datetime.now()
    )
    context.update(template_context)  # Client defined context
    try:
        return template.render(**context)  # Render with context
    except jinja2.TemplateError:
        raise HTTPException(400, 'Error while rendering a template.')


def text_from_html(html_str: str) -> str:
    """ Extract text from html """
    return BeautifulSoup(html_str, html5lib.__name__).text
