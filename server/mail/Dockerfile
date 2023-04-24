ARG PYTHON_VERSION=latest

FROM python:${PYTHON_VERSION}

RUN apt-get update && apt-get install -y \
    python3-pip \
    python3-venv \
    python3-dev \
    python3-setuptools \
    python3-wheel

RUN mkdir -p /app
WORKDIR /app

COPY requirements.txt .
RUN pip install -U -r requirements.txt

COPY . .

EXPOSE 5000
CMD ["python", "main.py"]
