import httpx
import asyncio
from application.abl.mail_gun import *


async def main():
    async with httpx.AsyncClient() as session:
        response = await session.post(
            'http://localhost:5000/mail/send',
            json=MailSendDtoIn(
                to=['dav.tlaskal@gmail.com'],
                subject='This is a test',
                text='Testing',
                template_name='podpora.html',
                template_context={
                    'text': 'Nějaký text',
                    'button': 'knoflík',
                    'text_after': 'Text nakonec'
                }
            ).dict()
        )
        print(response.status_code, response.json())


asyncio.new_event_loop().run_until_complete(main())
