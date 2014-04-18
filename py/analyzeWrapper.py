import crawler
import preprocess
#import create_model

def analyze(username, token):
	limit = 1000
	data = crawler.crawl(username, token, limit)
    processedData = preprocess.preprocess(data)
    #(header, clf) = create_model.build_model('processed-data.csv')

if __name__ == '__main__':
    token = ''
    username = 'philip.anderson1'
    analyze(username, token)
