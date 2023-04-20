import jinja2
from pathlib import Path
from datetime import datetime

template_name = 'acknowledgement.html'
context = dict(
    now_utc=datetime.utcnow(),

    name='Jméno',
    email='random@mail.com',
    category='nějaká kategorie',
    message='zpráva vole',
    device='zařízení',
    type='typ nebo co',
    serialNumber='sériový číslo'
)

environment = jinja2.Environment(loader=jinja2.FileSystemLoader('./templates'))
template = environment.get_template(template_name)
Path('./rendered.html').write_text(template.render(**context), 'utf-8')
