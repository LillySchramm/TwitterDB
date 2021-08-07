FROM python:3

WORKDIR /

COPY requirements.txt .

RUN python -m pip install -r requirements.txt

COPY . .

ENV TWITTER_KEY=""
ENV MONGODB_URI=""

CMD ["python", "crawler.py"]
