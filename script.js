function getFile(url, callback){
	var xmlHttp = new XMLHttpRequest();

	xmlHttp.onreadystatechange = function(){
		if(xmlHttp.readyState === 4 && xmlHttp.status === 200){
            try {
				var data = JSON.parse(xmlHttp.responseText);
				callback(data);
            } catch(err) {
				console.error(err.message, xmlHttp);
				return;
			}
		}
	};

	xmlHttp.open('GET', url, true);
	xmlHttp.send();
}

function buildResultsTable(results){
	var output = '<table class="pure-table pure-table-bordered">';
	output += '<thead><tr><th colspan="3">Results</th></tr></thead><tbody>';

	results.forEach(function(result){
		output += '<tr><td>' + result.question + '</td>';
		output += '<td>' + result.formula + '</td>';
		output += '<td>' + result.answer + '</td></tr>';
	});

	output += '</tbody></table>';
	return output;
}

function processQuestion(question){
	var sentence = question.substr(8).substr(0, question.length -9);
	var formula = processSentence(sentence);
	var answer = calculate(sentence);

	return { 
		question: question, 
		formula: formula, 
		answer: answer 
	}
}

function processQuestions(questions){
	var results = [];

	questions.forEach(function(question){
		results.push(processQuestion(question));
	});

	var output = buildResultsTable(results);
	document.getElementById('display').innerHTML = output;
}

function clickHandler(){
	document.getElementById('display').innerHTML = 'Processing...';
	getFile('questions.json', processQuestions);
}

document.addEventListener('DOMContentLoaded', function(){
	var button = document.getElementById('processButton');
	button.addEventListener('click', clickHandler);
});
