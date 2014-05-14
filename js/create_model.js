function build_model(processedData) {
    var data = [];
    var likes = [];
    var header = [];
    header = processedData[0];
    for ( var r = 1; r < processedData.length; r++ ) {
        var datarow = [];
		var row = processedData[r];
        for ( var d = 0; d < row.length - 1; d++ ) {
            datarow.push(row[d]);
		}
        data.push(datarow);
        likes.push(row[row.length - 1]);
	}
	var model = findLineByLeastSquares(data, likes);
	console.log("Model created.");
    return [header, model];
}

function findLineByLeastSquares(X, Y) {
    var math = mathjs();
	var Xt = math.transpose(X);
	var XXt = math.multiply(Xt,X);
	var XXtI = math.inv(XXt);
	var XtY = math.multiply(Xt,Y);
	return math.multiply(XXtI,XtY);
}
