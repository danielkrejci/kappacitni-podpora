if __name__ == '__main__':
    import config
    import uvicorn

    uvicorn.run('application.app:app', host=config.host, port=config.port, reload=config.debug)
