(function () {
	var math = mathjs();
	var board = JXG.JSXGraph.initBoard('box', {boundingbox: [-10, 10, 10, -10], axis:true});

	var generateField = function (func, sqrSize, numSqrs) {
			var halfSqr = sqrSize * 0.5;
			var pointsArr = [], lineArr = [], p1 = [], p2 = [];
			var slope = 0;
			
			if (board)
				JXG.JSXGraph.freeBoard(board);
			
			board = JXG.JSXGraph.initBoard('box', {boundingbox: [-10, 10, 10, -10], axis:true});
			
			NProgress.start();
			var tempInterval = setInterval(function () {
				NProgress.inc();
			}, 500);
			for (var y = 0 - numSqrs * sqrSize + halfSqr, lastY = numSqrs * sqrSize - halfSqr; y < lastY; y += sqrSize) {
				for (var x = 0 - numSqrs * sqrSize + halfSqr, lastX = numSqrs * sqrSize - halfSqr; x < lastX; x += sqrSize) {
					slope = calcSlope(func, x, y);
					p1 = [];
					p2 = [];
					if (slope === 1) {
						p1 = [x - halfSqr, y - halfSqr];
						p2 = [x + halfSqr, y + halfSqr];
					}
					else if (slope > 1) {
						p1 = [findX(y - halfSqr, x, y, slope), y - halfSqr]; //find x
						p2 = [findX(y + halfSqr, x, y, slope), y + halfSqr]; //find x
					}
					else if (0 < slope && slope < 1) {
						p1 = [x - halfSqr, findY(x - halfSqr, x, y, slope)]; //find y
						p2 = [x + halfSqr, findY(x + halfSqr, x, y, slope)]; //find y
					}
					else if (slope === 0) {
						p1 = [x - halfSqr, y];
						p2 = [x + halfSqr, y];
					}
					else if (-1 < slope && slope < 0) {
						p1 = [x - halfSqr, findY(x - halfSqr, x, y, slope)];
						p2 = [x + halfSqr, findY(x + halfSqr, x, y, slope)];
					}
					else if (slope < -1) {
						p1 = [findX(y + halfSqr, x, y, slope), y + halfSqr];
						p2 = [findX(y - halfSqr, x, y, slope), y - halfSqr];
					}
					else if (slope === -1) {
						p1 = [x - halfSqr, y + halfSqr];
						p2 = [x + halfSqr, y - halfSqr];
					}
					else
						console.log('We just broke math..');

					var point1 = board.create('point', p1, {
		  				visible: false
		  			});
		  			var point2 = board.create('point', p2, {
		  				visible: false
		  			});
		  			board.create('segment', [point1, point2], {
		  				strokeWidth: 1
		  			});
		  			/*pointsArr.push($.extend({}, point1));*/
		  			/*pointsArr.push($.extend({}, point2));*/
		  			/*board.removeObject(point1); 
		  			board.removeObject(point2);*/ 
		  			/*lineArr.push($.extend({}, l));*/
		  		}
		  	}
		  	clearInterval(tempInterval);
			NProgress.done(true);
	};

	var findX = function (y, xCenter, yCenter, m) {
		return (y - yCenter + m * xCenter) / m;
	};

	var findY = function (x, xCenter, yCenter, m) {
		return m * x + yCenter - m * xCenter;
	};

	var calcSlope = function(func, x, y) {
		var scope = {};
		scope ['x'] = x; 
		scope ['y'] = y; 
		console.log('scope:', scope);
		return math.eval(func, scope);
	};

	$('#generateField').on('click', function () {
		var f = $("#math-input-box").mathquill('latex');
		if (f.length === 0)
			return;
		console.log('f:', f);

		var sqrSize = Number($('#sqrSize').val());
		var numSqrs = Number($('#numSqrs').val());
		generateField(f, sqrSize, numSqrs);
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