import crawler
import preprocess
#import create_model

if __name__ == '__main__':
    token = ''
    username = 'philip.anderson1'
    limit = 1000
    data = crawler.crawl(username, token, limit)
    processedData = preprocess.preprocess(data)
    #(header, clf) = create_model.build_model('processed-data.csv')
