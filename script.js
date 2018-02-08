$(function(){
	function errorHandler(error){
		console.log('Something went wrong while trying to retrieve file!', error);
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
		$('#display').html(output);
	}

	$('#processButton').on('click', function(e){
		$('#display').html('Processing...');
		$.getJSON('questions.json').then(processQuestions, errorHandler);
	});
});
