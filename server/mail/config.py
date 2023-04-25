import os
from pathlib import Path
from decouple import AutoConfig

env = AutoConfig()
base_path = Path(os.path.abspath(os.path.dirname(__file__)))
templates_path = base_path / 'templates'
resources_path = base_path / 'resources'

# Server settings
host = env('HOST', default='0.0.0.0')
port = env('PORT', default=5000, cast=int)
debug = env('DEBUG', default=True, cast=bool)

# App description
app_name = 'Kappacitní Podpora mailer'
app_version = '0.1.3'

# App settings
default_http_timeout = 10  # In seconds
default_send_method = env('DEFAULT_SENDING_METHOD', default='mailgun')
default_sender = 'Kappacitní Podpora <kappasupport@danielkrajci.cz>'

# Mail Gun settings
mail_gun_auth = 'api', 'e6822a56e977424d34d6d86c378bc04b-7764770b-f803d377'
mail_gun_sandbox = 'sandboxe08a2604ceed4538970daa8d886130b0.mailgun.org'
mail_gun_default_sender = f'Kappacitní Podpora <mailgun@{mail_gun_sandbox}>'  # Or default_sender

# Mail Chimp settings
mail_chimp_api_key = 'md-Gia4VjmstOJIZRw_-w_NKA'
