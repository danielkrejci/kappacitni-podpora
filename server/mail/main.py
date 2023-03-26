from application.app import app

if __name__ == '__main__':
    import config
    import uvicorn

    uvicorn.run(app, host=config.host, port=config.port)
