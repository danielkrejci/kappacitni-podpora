import config
from fastapi import FastAPI
from fastapi.templating import Jinja2Templates

from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from uvicorn.middleware.proxy_headers import ProxyHeadersMiddleware

app = FastAPI(
    title=config.app_name,
    version=config.app_version,
    debug=config.debug
)

# Templating - "Hacked" to be used as email templating
templates = Jinja2Templates(config.templates_path)

# Middleware
app.add_middleware(GZipMiddleware)
app.add_middleware(CORSMiddleware, allow_origins='*')
app.add_middleware(TrustedHostMiddleware, allowed_hosts='*')
app.add_middleware(ProxyHeadersMiddleware, trusted_hosts='*')
