from pymongo import MongoClient
from pymongo.database import Database

import secret
import requests
import json
import schedule
import datetime
import time
from tweet import Tweet
from threading import Thread

now = datetime.datetime.now()
CUR_TIMESTAMP = int(datetime.datetime(year=now.year, month=now.month, day=now.day, hour=now.hour).timestamp())

TOTAL_TAGS = 0
TOTAL_HASHTAGS = 0
TOTAL_TWEETS = 0
TOTAL_RETWEETS = 0

DATA_TAGS = {}
DATA_HASHTAGS = {}

DB = 0


# Twitter API stuff

def create_url():
    return "https://api.twitter.com/2/tweets/sample/stream"


def create_headers(bearer_token):
    headers = {"Authorization": "Bearer {}".format(bearer_token)}
    return headers


def connect_to_endpoint():
    url = create_url()
    headers = create_headers(secret.TWITTER_KEY)

    schedule.every(25).minutes.do(save)
    schedule.every().second.do(updateTimestamp)

    response = requests.request("GET", url, headers=headers, stream=True)

    for response_line in response.iter_lines():
        if response_line:
            if b"data" in response_line:
                json_response = json.loads(response_line)
                handleTweet(json_response["data"]["text"])
                schedule.run_pending()
        if response.status_code != 200:
            print(response.status_code)
            raise Exception(
                "Request returned an error: {} {}".format(
                    response.status_code, response.text
                )
            )


# Tweet handling

def clean(text, forbidden):
    for x in forbidden:
        text = text.replace(x, " ")
    return text


def handleTweet(text: str):
    global TOTAL_TWEETS, TOTAL_RETWEETS, TOTAL_HASHTAGS, TOTAL_TAGS, DATA_HASHTAGS, DATA_TAGS

    try:

        t = Tweet(
            clean(text, ["\n", "\t", ".", ",", "(", ")", "{", "}", "-", "+", ":", "/", "\\", "'", "\"", "!", "?", "=",
                         "…"]))

        TOTAL_TWEETS += 1
        if text.startswith("RT"):
            TOTAL_RETWEETS += 1

        TOTAL_TAGS += len(t.tags)
        TOTAL_HASHTAGS += len(t.hashtags)

        for tag in t.tags:
            if tag in DATA_TAGS.keys():
                DATA_TAGS[tag] += 1
            else:
                DATA_TAGS[tag] = 1

        for hashtag in t.hashtags:
            if hashtag in DATA_HASHTAGS.keys():
                DATA_HASHTAGS[hashtag] += 1
            else:
                DATA_HASHTAGS[hashtag] = 1

    except:
        print("ERROR")
        pass


def updateTimestamp():
    global CUR_TIMESTAMP

    old_timestamp = CUR_TIMESTAMP

    now = datetime.datetime.now()
    _CUR_TIMESTAMP = int(datetime.datetime(year=now.year, month=now.month, day=now.day, hour=now.hour).timestamp())

    if old_timestamp != _CUR_TIMESTAMP and old_timestamp != 0:

        save(True)
        CUR_TIMESTAMP = _CUR_TIMESTAMP
        calcTop(old_timestamp)



# Database handling

def save(join: bool = False):
    global DATA_TAGS, DATA_HASHTAGS, DB

    # To Avoid Random Thread Issues
    _DATA_TAGS = DATA_TAGS
    _DATA_HASHTAGS = DATA_HASHTAGS

    DATA_TAGS = {}
    DATA_HASHTAGS = {}

    t = Thread(name="save", target=_save, args=(_DATA_TAGS, _DATA_HASHTAGS))
    t.start()

    if join:
        t.join()
        print("Save finished sync")


def _save(tags: dict, hashtags: dict):
    start = datetime.datetime.now().timestamp()

    print("Saving.")

    col = DB["tags"]

    uniqueTags = col.count()

    print("Saving " + str(len(tags)) + " tags.")
    for tag in tags.keys():
        count = tags[tag]
        if count >= 2:

            _doc = col.find({"name": tag}).limit(1)
            doc = {}
            if _doc.count() == 0:
                doc = {
                    "name": tag,
                    "timeline": []
                }
            else:
                doc = _doc[0]

            if len(doc["timeline"]) != 0 and doc["timeline"][0]["timestamp"] == CUR_TIMESTAMP:
                doc["timeline"][0]["count"] += count
            else:
                doc["timeline"].insert(0, {
                    "timestamp": CUR_TIMESTAMP,
                    "count": count
                })

                col.update_one({"name": tag}, {"$set": doc}, upsert=True)

    col = DB["hashtags"]

    uniqueHashTags = col.count()

    print("Saving " + str(len(hashtags)) + " hashtags.")
    for hashtag in hashtags.keys():
        count = hashtags[hashtag]
        if count >= 2:

            _doc = col.find({"name": hashtag}).limit(1)
            doc = {}
            if _doc.count() == 0:
                doc = {
                    "name": hashtag,
                    "timeline": []
                }
            else:
                doc = _doc[0]

            if len(doc["timeline"]) != 0 and doc["timeline"][0]["timestamp"] == CUR_TIMESTAMP:
                doc["timeline"][0]["count"] += count
            else:
                doc["timeline"].insert(0, {
                    "timestamp": CUR_TIMESTAMP,
                    "count": count
                })

                col.update_one({"name": hashtag}, {"$set": doc}, upsert=True)

    col = DB["totals"]
    col.update_one({"timestamp": CUR_TIMESTAMP}, {"$set": {
        "timestamp": CUR_TIMESTAMP,
        "count_retweets": TOTAL_RETWEETS,
        "count_tweets": TOTAL_TWEETS,
        "count_tags": TOTAL_TAGS,
        "count_hashtags": TOTAL_HASHTAGS,
        "unique_tags": uniqueTags,
        "unique_hashtags": uniqueHashTags
    }}, upsert=True)

    print("Done. Took " + str(datetime.datetime.now().timestamp() - start) + " seconds.")


def loadTotals(db: Database):
    global TOTAL_TWEETS, TOTAL_RETWEETS, TOTAL_HASHTAGS, TOTAL_TAGS

    col = db["totals"]

    raw = col.find().sort("timestamp", -1).limit(1)

    raw = raw[0]

    TOTAL_TWEETS = raw["count_tweets"]
    TOTAL_RETWEETS = raw["count_retweets"]
    TOTAL_TAGS = raw["count_tags"]
    TOTAL_HASHTAGS = raw["count_hashtags"]


def calcTop(t: int):
    print("Calculating tops")

    col = DB["tags"]
    top_tags = col.find({"timeline.0.timestamp": t}).sort("timeline.0.count", -1).limit(100)
    _top_tags = []
    for x in top_tags:
        _top_tags.append(
            {
                "name": x["name"],
                "count": x["timeline"][0]["count"]
            }
        )

    col = DB["hashtags"]
    top_hashtags = col.find({"timeline.0.timestamp": t}).sort("timeline.0.count", -1).limit(100)
    _top_hashtags = []
    for x in top_hashtags:
        _top_hashtags.append(
            {
                "name": x["name"],
                "count": x["timeline"][0]["count"]
            }
        )

    col = DB["top"]
    col.insert_one({
        "timestamp": t,
        "tags": _top_tags,
        "hashtags": _top_hashtags
    })


if __name__ == "__main__":
    mongoClient = MongoClient(
        secret.MONGODB_URI)
    DB = mongoClient["TwitterDB"]

    loadTotals(DB)
    save(True)

    connect_to_endpoint()
