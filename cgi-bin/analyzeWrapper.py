#!/Python27/python
import cgi, cgitb 

import crawler
import preprocess
#import create_model

cgitb.enable()  # for troubleshooting

params = cgi.FieldStorage()
analyze(params["username"], params["token"])

def analyze(username, token):
	limit = 1000
	data = crawler.crawl(username, token, limit)
    processedData = preprocess.preprocess(data)
    #(header, clf) = create_model.build_model('processed-data.csv')
