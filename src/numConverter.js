/*
Author: Tyler Manser
Date: 07/11/2014
What: Program translates a number (can contain decimals) to a string representation

Exercise 1 - Write some code that will accept an amount and convert it to the appropriate string representation.
Example: Convert 2523.04 to "Two thousand five hundred twenty-three and 04/100 dollars"
*/

var numConverter = (function () {

	var regExPattern= /^-?([0-9]{1,15})?(\.[0-9]*)?$/;
	var $button = $("#numForm button");
	var parts = [];
	var isSingleDigit = true;
	var invalidString = "Please enter a valid number (ie 2523.04). Also ensure the number is below 1e15 (1 quadrillion).";
	
	//store off number conversions (input to string representation)
	var singles = {
		0  : "", //placeholder instead of zero (zero has its own special use case)
		1  : "one",
		2  : "two",
		3  : "three",
		4  : "four",
		5  : "five",
		6  : "six",
		7  : "seven",
		8  : "eight",
		9  : "nine"
	};
	var teens = {
		0 : "ten",
		1 : "eleven",
		2 : "twelve",
		3 : "thirteen",
		4 : "fourteen",
		5 : "fifteen",
		6 : "sixteen",
		7 : "seventeen",
		8 : "eighteen",
		9 : "nineteen"
	};
	var doubles = {
		0 : "twenty",
		1 : "thirty",
		2 : "fourty",
		3 : "fifty",
		4 : "sixty",
		5 : "seventy",
		6 : "eighty",
		7 : "ninety"
	};

	return {
	
		//initializer of Number Converter program
		init : function() {
			this.setUpListeners();
		},
		
		//set up event listeners on dom
		setUpListeners : function() {
			$button.on("click",function() {
				var val = $("#numForm input").val();
				var str = numConverter.translateNumToString(val); 
				$("#outputContainer").empty().append(str);
				isSingleDigit = true; //reset dirty flag in case "0" is the next input so this flag has default value
				return false;
			});
		},
		
		//main function to translate a number to a string representation
		translateNumToString : function(input) {
			if(numConverter.validateInput(input))
			{
				input = this.fixDecimals(input);
				parts = input.split(".");
				var left = this.capitaliseFirstLetter(this.convertLeftSide(parts[0]));
				var right = this.convertRightSide(parts[1]);
				return left + right;
			}
			
			return invalidString;
		},
		
		//validate all user input with regEx
		validateInput : function(input) {
			//if(typeof input !== 'number'){
			//	$("#outputContainer").empty().append("Please enter a valid number!");
			//	return false;
			//}
			if(input == "") { return false; }
			var patt = new RegExp(regExPattern); //could use .match() instead
			return patt.test(input);
		},
		
		//fix decimals to two places
		fixDecimals : function(input) {
			input = Number(input);
			return input.toFixed(2); //alternatively could limit decimals through regex
		},
		
		//convert number on left side of decimal to string
		convertLeftSide : function(input) {
			var numString = "";
			
			//negatives
			if (input < 0) {
				numString = "negative " + this.convertLeftSide(-input);
			}
			//case for zero
			else if(isSingleDigit && input == 0) {
				numString = "zero";
			}
			//1 to 9
			else if(input > 0 && input < 10) {
				numString = singles[input];
			}
			//10 to 19
			else if(input >= 10 && input < 20) {
				numString = teens[input - 10];
			}
			//20 to 100
			else if(input >= 20 && input < 1e2) {
				isSingleDigit = false;
				var insertDash = input % 10 > 0;
				numString = doubles[Math.floor(input / 10) - 2] + (insertDash ? "-" : " ") + this.convertLeftSide(input % 10);
			}
			//100 to 999
			else if(input >= 1e2 && input < 1e3) {
				isSingleDigit = false;
				numString = this.convertLeftSide(Math.floor(input / 1e2)) + " hundred " + this.convertLeftSide(input % 1e2);
			}
			//1000 to 999999 (999 thousand)
			else if(input >= 1e3 && input < 1e6) {
				isSingleDigit = false;
				numString = this.convertLeftSide(Math.floor(input / 1e3)) + " thousand " + this.convertLeftSide(input % 1e3);
			}
			//1 mill to 999999999 (999 mill)
			else if(input >= 1e6 && input < 1e9) {
				isSingleDigit = false;
				numString = this.convertLeftSide(Math.floor(input / 1e6)) + " million " + this.convertLeftSide(input % 1e6);
			}
			//1 bill to 999999999999 (999 bill)
			else if(input >= 1e9 && input < 1e12) {
				isSingleDigit = false;
				numString = this.convertLeftSide(Math.floor(input / 1e9)) + " billion " + this.convertLeftSide(input % 1e9);
			}
			//1 trill to 100 trill
			else if(input >= 1e12 && input < 1e15) {
				isSingleDigit = false;
				numString = this.convertLeftSide(Math.floor(input / 1e12)) + " trillion " + this.convertLeftSide(input % 1e12);
			}
			
			return numString.replace(/\s+/g,' ').trim(); //trim off any white space between words or after
		},
		
		//convert number on right side of decimal to string
		convertRightSide : function(input) {
			if(input) {
				return " and " + input + "/100 dollars" 
			}
			
			return "";
		},
		
		//capitalise first letter in string and slice on rest of string
		capitaliseFirstLetter : function(input) {
			return input.charAt(0).toUpperCase() + input.slice(1);
		}
	};
	
})();

$(document).ready(function() {
	numConverter.init();
});