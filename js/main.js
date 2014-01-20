(function () {
	var board = JXG.JSXGraph.initBoard('box', {boundingbox: [-10, 10, 10, -10], axis:true});

	var generateField = function (func, sqrSize, numSqrs) {
		var dataObj = {};
		dataObj['func'] = func;
		dataObj['sqrSize'] = sqrSize;
		dataObj['numSqrs'] = numSqrs;
		
		NProgress.start();
		
		var tempInterval = setInterval(function () {
			NProgress.inc();
		}, 1000);

		var myWorker = new Worker("js/generateField.js");

		if (board)
			JXG.JSXGraph.freeBoard(board);
		board = JXG.JSXGraph.initBoard('box', {boundingbox: [-10, 10, 10, -10], axis:true});

		myWorker.onmessage = function (oEvent) {
		  	console.log("Worker said : " + oEvent.data);
		  	if (oEvent.data.finished) {
		  		clearInterval(tempInterval);
				NProgress.done(true);
			}
		  	else {
		  		point1 = board.create('point', oEvent.data[0], {
		  			visible: false
		  		});
		  		point2 = board.create('point', oEvent.data[1], {
		  			visible: false
		  		});
		  		board.create('segment', [point1, point2], {
		  			strokeWidth: 1
		  		});	
		  	}
		};
		myWorker.postMessage(dataObj);
	};

	String.prototype.replaceAll = function (searchStr, replaceStr) {
		return this.split(searchStr).join(replaceStr);
	}

	var parseLatex = function (latex) {
		return latex.replaceAll('{','(')
			 		.replaceAll('}',')')
			 		.replaceAll('\\right)',')')
			 		.replaceAll('\\left(','(')
			 		.replaceAll('\\cdot ','*')
			 		.replaceAll('\\cdot','*')
			 		.replaceAll('\\pi','pi')
			 		.replaceAll('\\sqrt','sqrt');
			 		/*.replace('\\log_b','(')
			 		.replace('{','(')*/
	};

	$('#generateField').on('click', function () {
		var f = $("#math-input-box").mathquill('latex');
		if (f.length === 0)
			return;
		console.log('f:', f);
		console.log('parseLatex(f):', parseLatex(f));
		var sqrSize = Number($('#sqrSize').val());
		var numSqrs = Number($('#numSqrs').val());
		generateField(parseLatex(f), sqrSize, numSqrs);
	});

	$('#sqrSize').on('change', function () {
		if (isNaN($(this).val()))
			$(this).val(0.5);
	});

	$('#numSqrs').on('change', function () {
		if (isNaN($(this).val()) || $(this).val().length === 0)
			$(this).val(20);
	});
})();