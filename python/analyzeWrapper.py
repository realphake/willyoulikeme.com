#!/Python27/python
import cgi, cgitb 

import crawler
import preprocess
import create_model

#cgitb.enable()  # for troubleshooting

#params = cgi.FieldStorage()
#analyze(params["username"], params["token"])

def analyze(username, token, limit):
    data = crawler.crawl(username, token, limit)
    processedData = preprocess.preprocess(data)
    clf = create_model.build_model(processedData)
    print clf

if __name__ == '__main__':
    token = 'CAACEdEose0cBAC3HfeQAipAXdjwuixAgdkLwxCBzHuW1G5bzAcGezjejvEZAlh6ZBm6yqAnuxlZBMoZBdpXHdDY9TJUuOS1ZA9zC8auDshwUZCF0Ap45eoDDouPV3ZCF1eTh72yaqMuph8LKDdPdFc5MbFqOtSRN1ZBqCrcoxlECWYMZAxZCSgZCTUr2GI5aO9r0PEcUnQZBbYPEFgZDZD'
    username = 'philip.anderson1'
    limit = 1000
    analyze(username, token, limit)
