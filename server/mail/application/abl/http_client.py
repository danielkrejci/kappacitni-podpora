import httpx
import config


def get_async_session(*args, **kwargs) -> httpx.AsyncClient:
    session = httpx.AsyncClient(*args, **kwargs)
    session.headers.update({
        'User-Agent': f'{config.app_name}/{config.app_version}'
    })
    return session
