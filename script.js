$(function(){
	
	function getUnits(word)
	{
		if(word.length == 0) return 0;
		
		switch(word)
		{
			case "one":       return 1;
			case "two":       return 2;
			case "three":     return 3;
			case "four":      return 4;
			case "five":      return 5;
			case "six":       return 6;
			case "seven":     return 7;
			case "eight":     return 8;
			case "nine":      return 9;
			case "ten":       return 10;
			case "eleven":    return 11;
			case "twelve":    return 12;
			case "thirteen":  return 13;
			case "fourteen":  return 14;
			case "fifteen":   return 15;
			case "sixteen":   return 16;
			case "seventeen": return 17;
			case "eighteen":  return 18;
			case "nineteen":  return 19;
			case "twenty":    return 20;
			case "thirty":    return 30;
			case "forty":     return 40;
			case "fifty":     return 50;
			case "sixty":     return 60;
			case "seventy":   return 70;
			case "eighty":    return 80;
			case "ninety":    return 90;
			case "hundred":   return 100;
			case "thousand":  return 1000;
		}
		
		var index, preWord, postWord;
		
		index = word.search(" ");
		preWord = word.substr(0, index);
		postWord = word.substr(preWord.length + 1);
		
		if(index >= 0){
			return getUnits(preWord) * getUnits(postWord);
		}
		
		index = word.search("-");
		preWord = word.substr(0, index);
		postWord = word.substr(preWord.length + 1);
		
		return (index >= 0) ? getUnits(preWord) + getUnits(postWord) : 0;
	}
	
	function getMixedUnits(words)
	{
		var spaceIndex = words.search(" ");
		var preWord = words.substr(0, spaceIndex);
		var postWord = words.substr(preWord.length + 1);
		
		return (spaceIndex >= 0) ? getUnits(preWord) * getUnits(postWord) : getUnits(words);
	}
	
	function getNumber(words)
	{
		var andIndex = words.search(" and ");
		var mixedWords = words.substr(0, andIndex);
		var unitWords = words.substr(mixedWords.length + 5);
		
		return (andIndex >= 0) ? getMixedUnits(mixedWords) + getUnits(unitWords) : getUnits(words);
	}
	
	function calculate(sentence)
	{
		var first = '', second = '';
		
		var minus = sentence.search(" minus ");
		var plus = sentence.search(" plus ");
		var times = sentence.search(" times ");
		
		if(plus >= 0)
		{
			first = sentence.substr(0, plus);
			second = sentence.substr(plus + 6);
			
			return calculate(first) + calculate(second);
		}	
		
		if(minus >= 0)
		{
			first = sentence.substr(0, minus);
			second = sentence.substr(minus + 7);
			
			var minusIndex = second.search(" minus ");
			var third = second.substr(0, minusIndex);
			var fourth = second.substr(minusIndex + 7);
			
			if(minusIndex >= 0){
				return calculate(first) - (calculate(third) + calculate(fourth));
			}
			
			return calculate(first) - calculate(second);
		}
		
		if(times >= 0)
		{
			first = sentence.substr(0, times);
			second = sentence.substr(times + 7);
		
			return calculate(first) * calculate(second);
		}
		
		return getNumber(sentence);
	}
	
	function processSentence(sentence)
	{
		var first = '', second = '';
		
		var minus = sentence.search(" minus ");
		var plus = sentence.search(" plus ");
		var times = sentence.search(" times ");
		
		if(plus >= 0)
		{
			first = sentence.substr(0, plus);
			second = sentence.substr(plus + 6);
			
			return processSentence(first) + ' + ' + processSentence(second);
		}	
		
		if(minus >= 0)
		{
			first = sentence.substr(0, minus);
			second = sentence.substr(minus + 7);
			
			return processSentence(first) + ' - ' + processSentence(second);
		}
		
		if(times >= 0)
		{
			first = sentence.substr(0, times);
			second = sentence.substr(times + 7);
		
			return processSentence(first) + ' * ' + processSentence(second);
		}
		
		var number = getNumber(sentence);
		return " " + number;
	}
	
	function processQuestions(questions)
	{
		var results = [];
		var len = questions.length;
		
		for(var i = 0; i < len; ++i)
		{
			var sentence = questions[i].substr(8).substr(0, questions[i].length -9);
			results.push(calculate(sentence));
		}
		
		return results;
	}
	
	function getFunction(result){
		var questions = result["Questions"];
		var results = processQuestions(questions);
		
		var display = $('#display'), output = '';
		
		for(var i = 0; i < questions.length; ++i)
		{
			var sentence = questions[i].substr(8).substr(0, questions[i].length -9).toLowerCase();
			//if(sentence.search(" minus ") >= 0)
				output += "Q[" + (i + 1) + "]: " + sentence; 
				output += '<span class="floater">' + processSentence(sentence) + ' = ' + results[i] + '</span><br/>';
		}
		
		display.html(output);
	}
	
	$('#getButton').on('click', function(e){
		e.preventDefault();
		
		$.ajax({
			type: 'GET',
			url: 'http://multiplysixbynine.com:8000/v1/questions',
			crossDomain: true,
			dataType: 'json',
			jsonpCallback: 'callback',
			success: getFunction
		});
	});
	
	$('#submitButton').on('click', function(e){
		e.preventDefault();
		
		$.ajax({
			type: 'GET',
			url: 'http://multiplysixbynine.com:8000/v1/questions',
			crossDomain: true,
			dataType: 'json',
			jsonpCallback: 'callback',
			success: function(result){
				var uri = 'github.com/DOOMitru'
				var key = result["Key"];
				var questions = result["Questions"];
				var results = processQuestions(questions);
				
				$.ajax({
					type: 'POST',
					url: 'http://multiplysixbynine.com:8000/v1/answers',
					crossDomain: true,
					dataType: 'json',
					data: JSON.stringify({
						Url: uri,
						Key: key,
						Answers: results
					}),
					success: function(result) {
						$('#display').html(result["Message"] || result["Time"]);
						console.log(result)
					}
				});
				
			}
		});
	});
});