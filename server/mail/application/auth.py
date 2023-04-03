import json
import config
from application.dto.auth import UserDto
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials

security = HTTPBasic()
users_path = config.resources_path / 'users.json'


def get_current_user(credentials: HTTPBasicCredentials = Depends(security)) -> UserDto:
    users: dict = json.loads(users_path.read_text())
    user: dict = users.get(credentials.username)

    if not user or user['password'] != credentials.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Basic"},
        )

    user['username'] = credentials.username
    return UserDto.parse_obj(user)


AuthDepends = Depends(get_current_user)
