import json
import jinja2
from pathlib import Path
from datetime import datetime

template_name = 'ack.html'
context = dict(
    now_utc=datetime.utcnow(),
    **json.loads(Path('./sample_request.json').read_text('utf-8'))['template_context']
)

environment = jinja2.Environment(loader=jinja2.FileSystemLoader('./templates'))
template = environment.get_template(template_name)
Path('./rendered.html').write_text(template.render(**context), 'utf-8')
