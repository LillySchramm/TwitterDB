from pymongo import MongoClient
from pymongo.database import Database

import datetime
import secret

URLS_PER_SITEMAP = 7000
SITEMAP_TEMPLATE = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">[url]</urlset>'
SITEMAP_ITEM_TEMPLATE = "<url><loc>[loc]</loc><lastmod>[lastmod]</lastmod><changefreq>hourly</changefreq><priority>[imp]</priority></url>"


def saveSitemap(data, name, col):
    if temp != "":

        print("Saving " + name)

        col.update_one({"name": name}, {"$set": {"name": name, "data": SITEMAP_TEMPLATE.
                       replace("[url]", data)}}, upsert=True)


if __name__ == "__main__":
    now = datetime.datetime.now()

    print("Connecting.")

    mongoClient = MongoClient(
        secret.MONGODB_URI)
    DB = mongoClient["TwitterDB"]

    print("Cloning Hashtags")
    col = DB["hashtags"]

    HASHTAGS = col.find({}, {"_id": 0, "name": 1}).sort("_id", 1)

    print("Cloning Tags")
    col = DB["tags"]

    TAGS = col.find({}, {"_id": 0, "name": 1}).sort("_id", 1)

    print("Generating Sitemaps")

    col = DB["sitemaps"]

    temp = ""
    lastmod = now.date()

    i, j = 1, 1

    for x in TAGS:
        i += 1

        temp += SITEMAP_ITEM_TEMPLATE.replace("[loc]", "https://twitterdb.com/details/tag/" + x["name"][1:])\
            .replace("[lastmod]", str(lastmod))\
            .replace("[imp]", str(0.8))

        if i % URLS_PER_SITEMAP == 0:
            saveSitemap(temp, "t_" + str(j), col)
            j += 1
            temp = ""

    saveSitemap(temp, "t_" + str(j), col)
    temp = ""

    i, j = 1, 1

    for x in HASHTAGS:
        i += 1

        temp += SITEMAP_ITEM_TEMPLATE.replace("[loc]", "https://twitterdb.com/details/hashtag/" + x["name"][1:])\
            .replace("[lastmod]", str(lastmod))\
            .replace("[imp]", str(0.8))

        if i % URLS_PER_SITEMAP == 0:
            saveSitemap(temp, "ht_" + str(j), col)
            j += 1
            temp = ""

    saveSitemap(temp, "ht_" + str(j), col)

    temp = SITEMAP_ITEM_TEMPLATE.replace("[loc]", "https://twitterdb.com")\
    .replace("[lastmod]", str(lastmod))\
    .replace("[imp]", str(1.0))

    saveSitemap(temp, "main", col)
