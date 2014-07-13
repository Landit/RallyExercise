describe("Number Converter", function() {
	
	var invalidString;
	
	beforeEach(function () {
		invalidString = "Please enter a valid number (ie 2523.04). Also ensure the number is below 1e15 (1 quadrillion).";
	});
	
	it("can accept any positive number", function() {
		var output = numConverter.validateInput(1);
		expect(output).toBe(true);
	});

	it("can accept any negative number", function() {
		var output = numConverter.validateInput(-1);
		expect(output).toBe(true);
	});
	
	it("will fail on any strings", function() {
		var output = numConverter.validateInput("\"asdf\"");
		expect(output).toBe(false);
		var output2 = numConverter.validateInput("\"1\"");
		expect(output2).toBe(false);
	});
	
	it("will translate digits to strings", function() {
		expect(numConverter.convertLeftSide(0)).toBe("zero");
		expect(numConverter.convertLeftSide(1)).toBe("one");
		expect(numConverter.convertLeftSide(10)).toBe("ten");
		expect(numConverter.convertLeftSide(19)).toBe("nineteen");
		expect(numConverter.convertLeftSide(34)).toBe("thirty-four");
		expect(numConverter.convertLeftSide(12334)).toBe("twelve thousand three hundred thirty-four");
		expect(numConverter.convertLeftSide(-12334)).toBe("negative twelve thousand three hundred thirty-four");
		expect(numConverter.convertLeftSide(100000)).toBe("one hundred thousand");
		expect(numConverter.convertLeftSide(1234567890)).toBe("one billion two hundred thirty-four million five hundred sixty-seven thousand eight hundred ninety");
		expect(numConverter.convertLeftSide(-1234567890)).toBe("negative one billion two hundred thirty-four million five hundred sixty-seven thousand eight hundred ninety");
		expect(numConverter.translateNumToString("\"100\"")).toBe(invalidString);
		expect(numConverter.translateNumToString(2523.04)).toBe("Two thousand five hundred twenty-three and 04/100 dollars");
	});
	
	it("will trim additional white spaces", function() {
		expect(numConverter.convertLeftSide(100000)).toBe("one hundred thousand");
		expect(numConverter.convertLeftSide(100000)).not.toBe("one   hundred   thousand");
		expect(numConverter.convertLeftSide(100000)).not.toBe("one hundred thousand ");
		expect(numConverter.convertLeftSide(100000)).not.toBe("one hundred  thousand ");
	});
	
	it("will round off any decimals past two places", function() {
		var output = numConverter.fixDecimals(123.26555);
		expect(Number(output)).toBe(123.27);
	});
	
	it("will display decimals as part of a dollar", function() {
		var output = numConverter.fixDecimals(0.04);
		parts = output.split(".");
		expect(numConverter.convertRightSide(parts[1])).toBe(" and 04/100 dollars");
	});
	
	it("will capitalize the first character of the output string", function() {
		expect(numConverter.capitaliseFirstLetter("test")).toBe("Test");
		expect(numConverter.translateNumToString(100)).toBe("One hundred and 00/100 dollars");
	});
	
	it("will limit input to < 1 quadrillion", function() {
		expect(numConverter.translateNumToString(1000000000000000)).toBe(invalidString);
	});
	
});
