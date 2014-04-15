from sklearn import linear_model
from sklearn import svm
from sklearn.linear_model import SGDClassifier

import numpy as np
import math
import csv
import random
import copy

def build_model(csvFile):
    """
    This function uses a csv file created by the crawler to train a model
    (currently linear regression)
    """
    data = []
    likes = []
    header = []
    #read in data and likes
    with open(csvFile, 'rb') as csvfile:
        csvReader = csv.reader(csvfile, delimiter=',', quotechar='|')
        header = csvReader.next()
        for row in csvReader:
            datarow = []
            #we assume the likes are in the last column of the csv
            for d in row[0:-1]:
                datarow.append(float(d))
            data.append(datarow)
            likes.append(float(row[-1]))
    #split data into a training and test set
    testSize = int(math.ceil(len(data)*0.1)) #take 20 percent of the data

    combined = zip(data, likes)
    random.shuffle(combined)
    data[:], likes[:] = zip(*combined)
    
    trainData = data[:-testSize]
    testData = data[-testSize:]
    #do the same for the likes
    trainLikes = likes[:-testSize]
    testLikes = likes[-testSize:]

    #fit a model to the training data
    clf = linear_model.LinearRegression()
    #clf = linear_model.Perceptron()
    #clf = svm.SVR()
    #clf = linear_model.LogisticRegression()
    #clf = SGDClassifier()

    clfOutput = copy.deepcopy(clf)
    clf.fit(trainData, trainLikes)
    clfOutput.fit(data, likes)
    #print the results
    print('header: ', header)
    print('clf coef. learned: \n', clfOutput.coef_)
    print('predictions: \n', clf.predict(testData))
    print('actual data: \n', testLikes)
    print('Residual sum of squares: %.5f' % \
        np.median((clf.predict(testData)-testLikes)**2))
    print('Variance score: %.5f' % clf.score(testData, testLikes))
    return header, clfOutput

if __name__ == '__main__':
    (header, clf) = build_model('processed-data.csv')
    #print [i for i in header[:-1]]
    #print [i for i in clf.coef_]
