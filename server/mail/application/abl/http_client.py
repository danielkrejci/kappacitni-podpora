import httpx
import config


def get_async_session(*args, **kwargs) -> httpx.AsyncClient:
    defaults = dict(
        timeout=config.default_http_timeout
    )
    session = httpx.AsyncClient(*args, **{**defaults, **kwargs})
    session.headers.update({
        'User-Agent': f'{config.app_name}/{config.app_version}'
    })
    return session
