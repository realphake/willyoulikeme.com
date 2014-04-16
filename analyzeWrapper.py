import crawler
import preprocess
#import create_model

if __name__ == '__main__':
    token = 'CAACEdEose0cBACv836oYC2sSL64VrIVVxf6ksw1ohBxHQcRr0pXo2G29OuPgP4E8BBi9g5dfZAPDatDBYnIxf7HROD67ZCcq1qpJiadWKAYRpGb3yJQ3m5yDPPL1VvynAmQML4ZCGcLjhhQvS8MBUrZChkCVuze33t2CWeGUXnxH0thL4UA9c7xzGAgJjrukWGbtc9NvoQZDZD'
    username = 'philip.anderson1'
    limit = 1000
    data = crawler.crawl(username, token, limit)
    processedData = preprocess.preprocess('real-data.csv')
    #(header, clf) = create_model.build_model('processed-data.csv')
