var field = new Array(25);
var pigeons = [];
var bread = [];
var interval;
var numCycles = 0;

pigeons.push(new Pigeon());

initField(field,pigeons);

printField(field);

function Bread (x,y,e) {
	this._location = {x:x,y:y};
	this._e = e;
	this._value = Math.floor(Math.random()*10);
	this.e = function (e) {
		if (e) {
			this._e = e;
		} else {
			return this._e;
		}
	}
	this.value = function (value) {
		if (value) {
			this._value = value;
		} else {
			return this._value;
		}
	}
	this.location = function (x,y) {
		if (x && y) {
			this._location = {x:x,y:y}
		} else {
			return this._location;
		}
	}
}

function Pigeon () {
	this.id = Math.random();
	this._location = {x:0,y:0};

	this.location = function (x,y) {
		if (x && y) {
			this._location = {x:x,y:y}
		} else {
			return this._location;
		}
	}

	this.update = function () {
		var values = [];
		var weights = [];
		var capacity = 200;
		for (var i = 0; i < bread.length; i++) {
			values.push(bread[i].value());
			var pigeonLocation = this.location();
			var breadLocation = bread[i].location();
			var weight = (pigeonLocation.y - breadLocation.y)+(pigeonLocation.x - breadLocation.x);
			weights.push(Math.abs(weight));
		}
		console.log(values,weights);
		capacity = Math.min(Math.floor(sum(weights)),capacity);
		var matrix = getSolutionMatrix(values,weights,capacity);
		var subset = getOptimalSubset(matrix,weights);
		console.log(subset,matrix[weights.length][capacity]);
		for (var i = 0; i < subset.length; i++) {
			bread[subset[i]-1].e().innerHTML = '&nbsp;'+(i+1);
		}
	}
}

function start () {
	if (!interval) {
		interval = setInterval(update,1000);
	}
}

function stop () {
	if (interval) {
		clearInterval(interval);
		interval = null;
	}
}

function clearStage () {

	document.getElementById('stage').innerHTML = '';
}

function printCycles () {

	document.getElementById('cycles').innerHTML = numCycles;
}

function updatePigeons () {
	for (var i = 0; i < pigeons.length; i++) {
		pigeons[i].update();
	}
}

function update () {
	updatePigeons();
	clearStage();
	printField(field);
	printCycles();
	numCycles++;
}

function addPigeons (field,pigeons) {
	var numPigeons = pigeons.length;
	for (var i = 0; i < field.length; i++) {
		for (var j = 0; j <= field.length; j++) {
			if (Math.floor(Math.random()*100) < 1) {
				if (numPigeons) {
					var e = document.createElement('div');
					e.setAttribute('class','pigeon');
					e.innerHTML = '&nbsp;';
					field[i][j] = e;
					pigeons[numPigeons-1].location(i,j);
					numPigeons--;
				}
			}
		}
	}
}

function printField (field) {
	for (var i = 0; i < field.length; i++) {
		for (var j = 0; j <= field.length; j++) {
			document.getElementById('stage').appendChild(field[i][j]);
		}
		document.getElementById('stage').appendChild(document.createElement('br'));
	}
}

function addBread (field) {
	for (var i = 0; i < field.length; i++) {
		for (var j = 0; j <= field.length; j++) {
			if (Math.floor(Math.random()*100) < 5) {
				var e = document.createElement('div');
				e.setAttribute('class','bread');
				e.innerHTML = '&nbsp;';
				field[i][j] = e;
				bread.push(new Bread(i,j,e));
			}
		}
	}
}

function buildField (field) {
	for (var i = 0; i < field.length; i++) {
		field[i] = new Array(field.length);
		for (var j = 0; j <= field.length; j++) {
			var e = document.createElement('div');
			e.setAttribute('class','space');
			e.innerHTML = '&nbsp;';
			field[i][j] = e;
		}
	}
}

function initField (field,pigeons) {
	buildField(field);
	addBread(field);
	addPigeons(field,pigeons);
}

function init () {
	var values = [7,4,8,6,2,5];
	var weights = [2,3,5,4,2,3];
	var capacity = 9;
	capacity = Math.min(sum(weights),capacity);
	var matrix = getSolutionMatrix(values,weights,capacity);
	var subset = getOptimalSubset(matrix,weights);
}

function getSolutionMatrix(itemValues, weights, capacity) {
	var matrix =  new Array(itemValues.length + 1);
	for (var i = 0; i < matrix.length; i++){
		matrix[i] = new Array(capacity);
		for(var j = 0; j <= capacity; j++) {
			matrix[i][j] = 0;
		}
	}
	for(var i = 1; i <= itemValues.length; i++) {
		for (var j = 0; j <= capacity; j++) {
			if (j - Number(weights[i-1])  >= 0) {
				matrix[i][j] = Math.max(matrix[i-1][j], Number(itemValues[i-1]) + matrix[i-1][j-Number(weights[i-1])]);
			} else {
				matrix[i][j] = matrix[i-1][j];
			}
		}
	}
	return matrix;
}

function getOptimalSubset(solutionMatrix, weights) {
	var subset = new Array(1);
	var numItems = 0;
	var i = solutionMatrix.length - 1;
	for (var j = solutionMatrix[0].length - 1; j >= 0 && i > 0; i--) {
		// If the item is in the optimal subset, add it and subtract its weight
		// from the column we are checking.
		if (solutionMatrix[i][j] != solutionMatrix[i-1][j]) {
			subset[numItems] = i;
			j -= Number(weights[i-1]);
			numItems++;
		}
	}
	return subset;
}

function sum(array) {
	var sum = 0;
	for(var i = 0; i < array.length; i++) {
		sum += Number(array[i]);
	}
	return sum;
}