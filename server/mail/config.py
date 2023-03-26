import os
from pathlib import Path

env = os.environ
base_path = Path(os.path.abspath(os.path.dirname(__file__)))
templates_path = base_path / 'templates'

host = env.get('HOST', '0.0.0.0')
port = int(env.get('PORT', 5000))
debug = True

app_name = 'Podpora mailer'
app_version = '0.1.0'

mail_gun_auth = 'api', 'e6822a56e977424d34d6d86c378bc04b-7764770b-f803d377'
mail_gun_sandbox = 'sandboxe08a2604ceed4538970daa8d886130b0.mailgun.org'

default_sender = f'mailgun@{mail_gun_sandbox}'
