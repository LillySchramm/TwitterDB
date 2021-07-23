# This script is used to migrate the old data from an SQL server to the new MongoDB infrastructure.
from datetime import datetime, timedelta
import string
import emoji
import tweet
import pymongo
import pymysql as MySQLdb
import secret


def doesTableExist(table_name):
    global MSQL_CURSOR
    MSQL_CURSOR.execute(
        "SELECT * FROM INFORMATION_SCHEMA.TABLES where TABLE_TYPE = 'BASE TABLE' AND TABLE_NAME = '" + table_name + "'")
    lst = MSQL_CURSOR.fetchall()

    if not (lst == [] or lst == ()):
        return True

    return False


def clean(text, forbidden):
    text = remove_emojis(text)

    for x in forbidden:
        text = text.replace(x, " ")

    return text


def cleanTag(text):
    allowed = list(string.ascii_lowercase + string.ascii_uppercase + string.digits) + ["_", "@", " "]

    newtext = ""
    for letter in text:

        if letter in allowed:
            newtext += letter

    return newtext


def remove_emojis(s):
    return ''.join(c for c in s if c not in emoji.UNICODE_EMOJI['en'])


if __name__ == '__main__':

    print("Start to migrate.")

    MSQL_CONNECTION = MySQLdb.connect(
        host=secret.MSQL_HOST,
        user=secret.MSQL_USER,
        password=secret.MSQL_PWD
    )

    MSQL_CONNECTION.autocommit(True)
    MSQL_CURSOR = MSQL_CONNECTION.cursor()

    mongoClient = pymongo.MongoClient(
        secret.MONGODB_URI)
    db = mongoClient["TwitterDB"]

    MAX_HOURS_BACK = 180 * 24
    now = datetime(2021, 7, 20)

    tags = {}
    hashtags = {}

    print("READING")
    c = 0

    for i in range(MAX_HOURS_BACK):

        print(len(tags.keys()))
        print(len(hashtags.keys()))

        now = now - timedelta(hours=1)
        date = str(now.year) + ":" + str(now.month) + ":" + str(now.day) + "::" + str(now.hour)
        timestamp = int(now.timestamp())

        if doesTableExist("hashtags_" + date):
            ht = MSQL_CURSOR.execute("SELECT * FROM `eps_hashtags`.`hashtags_" + date + "`")
            res = MSQL_CURSOR.fetchall()

            for x in res:
                name = x[1].lower()
                name = clean(name,
                             ["\n", "\t", ".", ",", "(", ")", "{", "}", "-", "+", ":", "/", "\\", "'", "\"", "!", "?",
                              "=",
                              "…", "*", "&", "€", "$", ";", "・", "。", "．．．", "、", "⋮", " "])

                name = tweet.Tweet(name).hashtags

                if len(name) > 0:
                    name = name[0]
                    count = x[3]

                    if count >= 5:

                        if name not in hashtags.keys():
                            hashtags[name] = []

                        hashtags[name].append(
                            {
                                "timestamp": timestamp,
                                "count": count
                            }
                        )

            c += 1

        if doesTableExist("tags_" + date):
            ht = MSQL_CURSOR.execute("SELECT * FROM `eps_tags`.`tags_" + date + "`")
            res = MSQL_CURSOR.fetchall()

            for x in res:

                name = x[1].lower()
                name = clean(name,
                             ["\n", "\t", ".", ",", "(", ")", "{", "}", "-", "+", ":", "/", "\\", "'", "\"", "!", "?",
                              "=",
                              "…", "*", "&", "€", "$", ";", "・", "。", "．．．", "、", "⋮", " "])
                name = cleanTag(name)

                name = tweet.Tweet(name).tags

                if len(name) > 0:
                    name = name[0]
                    count = x[3]

                    if count >= 5:

                        if name not in tags.keys():
                            tags[name] = []

                        tags[name].append(
                            {
                                "timestamp": timestamp,
                                "count": count
                            }
                        )
            c += 1

        print(date)
        print("Read " + str(c) + " Tables")

    print("Uploading Hashtags")

    docs = []
    for i in hashtags.keys():
        docs.append(
            {
                "name": i,
                "timeline": hashtags[i]
            }
        )

    col = db["hashtags"]
    col.insert_many(docs)

    print("Uploading Tags")

    docs = []
    for i in tags.keys():
        docs.append(
            {
                "name": i,
                "timeline": tags[i]
            }
        )

    col = db["tags"]
    col.insert_many(docs)

    print("Finished migration.")
