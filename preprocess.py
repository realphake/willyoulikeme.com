import csv
import string
import re
import collections
import datetime

def preprocess(csvFile):
    # read csv
    with open(csvFile, 'r') as csvfile:
        csvReader = csv.reader(csvfile, delimiter=',', quotechar='|')
        procCsv = open('processed-data.csv', 'w')
        csvWriter = csv.writer(procCsv)
        try: header = csvReader.next()
        except AttributeError: header = next(csvReader)
        allWordsCounting = collections.Counter()
        postDicts = []
        postLengths = []
        postHasLink = []
        postHasPhoto = []
        postedInMorning = []
        postedInAfternoon = []
        postedInEvening = []
        postedInNight = []
        likes = []
        for row in csvReader:
            if row == []: continue
            likes.append(row[3])
            post = formatPost(row[0])
            tokens = set()
            postDict = {}
            tokenList = post.split()
            for token in tokenList:
                t = token.lower()
                postDict[t] = 1
                tokens.add(t)
                allWordsCounting[t] += 1
            postDicts.append(postDict)
            postLengths.append(row[1].zfill(3))
            postedInNight.append(timeBetween(0,secsSinceMidnight(row[2]),6))
            postedInMorning.append(timeBetween(6,secsSinceMidnight(row[2]),12))
            postedInAfternoon.append(timeBetween(12,secsSinceMidnight(row[2]),18))
            postedInEvening.append(timeBetween(18,secsSinceMidnight(row[2]),24))
            postHasLink.append(postHasA(row[6], 'link'))
            postHasPhoto.append(postHasA(row[6], 'photo'))
        allWords = [i for i, v in allWordsCounting.most_common(50)]
        allWords = allWords[10:]
        newHeader = allWords[:]
        newHeader += ["post_length","posted_at_night","posted_in_morning","posted_in_afternoon","posted_in_evening","post_has_link","post_has_photo",header[3]]
        csvWriter.writerow(newHeader)
        for pD in range(len(postDicts)):
            row = []
            for w in allWords:
                row.append(1*(w in postDicts[pD]))
            row += [postLengths[pD],postedInNight[pD],postedInMorning[pD],postedInAfternoon[pD],postedInEvening[pD],postHasLink[pD],postHasPhoto[pD],likes[pD]]
            csvWriter.writerow(row)
        print( "Preprocessing done." )

def postHasA(postType, thing):
    return (postType == thing)*1

def formatPost(post):
    return ''.join(ch for ch in re.sub('\s+', ' ', post) if ch not in set(string.punctuation))

def timeBetween(begin, ssm, end):
    return (ssm >= 3600*begin and ssm < 3600*end)*1

def secsSinceMidnight(dateString):
    date = datetime.datetime.strptime(dateString[11:19], "%H:%M:%S")
    try: secs_since_midnight = (date - date.replace(hour=0, minute=0, second=0, microsecond=0)).total_seconds()
    except AttributeError: secs_since_midnight = (date - date.replace(hour=0, minute=0, second=0, microsecond=0)).seconds
    return secs_since_midnight

if __name__ == '__main__':
    preprocess('real-data.csv')
