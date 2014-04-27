function build_model(processedData) {
    var data = [];
    var likes = [];
    var header = [];
    header = processedData[0];
    for ( var r = 1; r < processedData.length; r++ ) {
        var datarow = [];
        /** we assume the likes are in the last column of the csv **/
        // for d in row[0:-1]:
            // datarow.append(float(d))
        // data.append(datarow)
        // likes.append(float(row[-1]))
	}
    // #split data into a training and test set
    // testSize = int(math.ceil(len(data)*0.1))
    // combined = zip(data, likes)
    // random.shuffle(combined)
    // data[:], likes[:] = zip(*combined)
    
    // trainData = data[:-testSize]
    // testData = data[-testSize:]
    // #do the same for the likes
    // trainLikes = likes[:-testSize]
    // testLikes = likes[-testSize:]


    // clf = linear_model.LinearRegression()
    /** clf = linear_model.Perceptron() **/

	var clfOutput = [];
    // clfOutput = copy.deepcopy(clf)
    // clfOutput.fit(data, likes)
    // print('clf coef. learned: \n', clfOutput.coef_)
    return clfOutput
	
}
