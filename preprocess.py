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
            post = row[0]
            post = re.sub('\s+', ' ', post)
            post = ''.join(ch for ch in post if ch not in set(string.punctuation))
            tokens = set()
            postDict = {}
            tokenList = post.split()
            for token in tokenList:
                t = token.lower()
                postDict[t] = 1
                tokens.add(t)
                allWordsCounting[t] += 1
            postDicts.append(postDict)
            postLengths.append(row[1])
            date = datetime.datetime.strptime(row[2][11:19], "%H:%M:%S")
            try: secs_since_midnight = (date - date.replace(hour=0, minute=0, second=0, microsecond=0)).total_seconds()
            except AttributeError: secs_since_midnight = (date - date.replace(hour=0, minute=0, second=0, microsecond=0)).seconds
            postedInNight.append((secs_since_midnight >= 0 and\
                    secs_since_midnight < 3600*6)*1.0)
            postedInMorning.append((secs_since_midnight >= 3600*6 and\
                    secs_since_midnight < 3600*12)*1.0)
            postedInAfternoon.append((secs_since_midnight >= 3600*12 and\
                    secs_since_midnight < 3600*18)*1.0)
            postedInEvening.append((secs_since_midnight >= 3600*18 and\
                    secs_since_midnight < 3600*24)*1.0)
            postHasLink.append((row[6] == 'link')*1.0)
            postHasPhoto.append((row[6] == 'photo')*1.0)
        allWords = [i for i, v in allWordsCounting.most_common(50)]
        allWords = allWords[10:]
        newHeader = allWords[:]
        # Can't forget about [:]! Otherwise the header is a pointer to allwords!
        newHeader.append("post length")
        newHeader.append("posted at_night")
        newHeader.append("posted in_morning")
        newHeader.append("posted in_afternoon")
        newHeader.append("posted in_evening")
        newHeader.append("post has_link")
        newHeader.append("post has_photo")
        newHeader.append(header[3]) #number of likes
        csvWriter.writerow(newHeader)
        for pD in range(len(postDicts)):
            row = []
            for w in allWords:
                row.append(1.0*(w in postDicts[pD]))
            row.append(postLengths[pD])
            row.append(postedInNight[pD])
            row.append(postedInMorning[pD])
            row.append(postedInAfternoon[pD])
            row.append(postedInEvening[pD])
            row.append(postHasLink[pD])
            row.append(postHasPhoto[pD])
            row.append(likes[pD])
            csvWriter.writerow(row)
        print( "Preprocessing done." )

if __name__ == '__main__':
    preprocess('real-data.csv')
