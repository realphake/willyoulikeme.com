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
	console.log(model);
    return [header, model];
}

function findLineByLeastSquares(input, results) {
	return new Array(input[0].length+1).join('0').split('').map(parseFloat);
	
	// Matrix Xtr = MatrixMathematics.transpose(X); //X'
	// Matrix XXtr = MatrixMathematics.multiply(Xtr,X); //X'X
	// Matrix inverse_of_XXtr = MatrixMathematics.inverse(XXtr); //(X'X)^-1
	// if (inverse_of_XXtr == null) {
		// System.out.println("Matrix X'X does not have any inverse. So MLR failed to create the model for these data.");
		// return null;
	// }
	// Matrix XtrY = MatrixMathematics.multiply(Xtr,Y); //X'Y
	// return MatrixMathematics.multiply(inverse_of_XXtr,XtrY); //(X'X)^-1 X'Y
}