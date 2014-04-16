import csv
import string
import re
import collections
import datetime

def preprocess(data):
    allWordsCounting = collections.Counter()
    postDicts = []
    fullRows = []
    for row in data:
        if row == []: continue
        post = formatPost(row[0])
        postDict = {}
        for token in post.split():
            t = token.lower()
            postDict[t] = 1
            allWordsCounting[t] += 1
        postDicts.append(postDict)
        fullRows.append(makeRowOfFeatures(row))
    allWords = [i for i, v in allWordsCounting.most_common(50)]
    fullyProcessedDatabase = makeTheProcessedData(allWords,postDicts,fullRows)
    print( "Preprocessing done." )
    print(fullyProcessedDatabase)
    return fullyProcessedDatabase

def makeTheProcessedData(allWords,postDicts, fullRows):
    fullyProcessedDatabase = []
    for pD in range(len(postDicts)):
        row = []
        for w in allWords:
            row.append(1*(w in postDicts[pD]))
        row += fullRows[pD]
        fullyProcessedDatabase.append(row)
    return fullyProcessedDatabase

def makeRowOfFeatures(row):
    return [row[1], timeBetween(0,sSinceMid(row[2]),6), timeBetween(6,sSinceMid(row[2]),12),
            timeBetween(12,sSinceMid(row[2]),18), timeBetween(18,sSinceMid(row[2]),24),
            postHasA(row[6],'link'), postHasA(row[6],'photo'), row[3]]

def postHasA(postType, thing):
    return (postType == thing)*1

def formatPost(post):
    return ''.join(ch for ch in re.sub('\s+', ' ', post) if ch not in set(string.punctuation))

def timeBetween(begin, ssm, end):
    return (ssm >= 3600*begin and ssm < 3600*end)*1

def sSinceMid(dateString):
    date = datetime.datetime.strptime(dateString[11:19], "%H:%M:%S")
    try: secs_since_midnight = (date - date.replace(hour=0, minute=0, second=0, microsecond=0)).total_seconds()
    except AttributeError: secs_since_midnight = (date - date.replace(hour=0, minute=0, second=0, microsecond=0)).seconds
    return secs_since_midnight
