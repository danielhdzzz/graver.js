"use strict";

var graverLib = function graverLib(target) {
	var drawingWidth = 40;
	var drawingHeight = 20;
	var drawing = [];
	var strokeChar = "/";
	var backgroundChar = " ";
	var fullscreenSwitch = false;
	var titleFonts = {};
	var links = [];
	var charD = [12, 20];

	var options = {
		animated: false
	};

	var font = $(target).css("font-family");

	var loadFont = function loadFont(target) {
		$(target).append("<span id=\"tempInitFont\" style=\"opacity:0;\">asd</span>");
	};

	var getCharDimensions = function getCharDimensions(target) {
		var dimensions = [0, 0];
		var char = 'X';
		$(target).prepend("<div id=\"tempMeasure\" style=\"position:fixed;\"></div>");
		$("#tempMeasure").append(char + "<div class='measureChar' id='measureCharX' style='background-color: lime;'>" + char + "</div><br><div class='measureChar' id='measureCharY' style='background-color: blue;'>" + char + "</div><br>");
		dimensions[0] = $("#measureCharX").position().left;
		dimensions[1] = $("#measureCharY").position().top;

		$("#tempMeasure").remove();
		$("#tempInitFont").remove();
		return dimensions;
	};

	var init = function init() {
		drawing = [];
		for (var i = 0; i < drawingHeight; i++) {
			drawing.push("");
			for (var j = 0; j < drawingWidth; j++) {
				drawing[i] += backgroundChar;
			}
		}
	};

	var arraysEqual = function arraysEqual(arr1, arr2) {
		if (arr1.length !== arr2.length) {
			return false;
		}
		for (var i = arr1.length; i--;) {
			if (arr1[i] !== arr2[i]) {
				return false;
			}
		}
		return true;
	};

	String.prototype.replaceAt = function (index, replacement) {
		return this.substr(0, index) + replacement + this.substr(index + replacement.length);
	};

	String.prototype.splice = function (idx, rem, str) {
		return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
	};

	var midpoint = function midpoint(a, b) {
		return Math.floor((a + b) / 2);
	};

	var drawMidpoints = function drawMidpoints(p0, p1) {
		var middle = [midpoint(p0[0], p1[0]), midpoint(p0[1], p1[1])];
		point(middle[0], middle[1]);
		if ((p0[0] !== middle[0] || p0[1] !== middle[1]) && (p1[0] !== middle[0] || p1[1] !== middle[1])) {
			drawMidpoints(p0, middle);
			drawMidpoints(middle, p1);
		}
	};

	var insertStr = function insertStr(targetStr, str, pos) {
		if (targetStr !== undefined) {
			if (pos < targetStr.length - 1) {
				var output = [targetStr.slice(0, pos), str, targetStr.slice(pos)].join('');
				return output;
			} else {
				return targetStr;
			}
		}
	};

	// USER FUNCTIONS //
	function loadTitleFont() {

		var load = function load(arg) {
			var font = arg;
			var fontName = font + ".flf";
			var xhttp = new XMLHttpRequest();
			var fontFile = void 0;

			xhttp.onreadystatechange = function () {
				if (this.readyState == 4 && this.status == 200) {
					fontFile = xhttp.responseText;
					titleFonts[font] = fontFile;
				}
			};

			xhttp.open("GET", "/titleFonts/" + fontName, true);
			xhttp.send();
		};

		for (var i = 0; i < arguments.length - 1; i++) {
			load(arguments[i]);
		}

		//callback to render stuff after fonts are loaded
		var callback = arguments[arguments.length - 1];
		if (typeof callback == 'function') {
			callback();
		}
	}

	var size = function size(xc, yc) {
		drawingWidth = xc;
		drawingHeight = yc;
		// maybe not good? insted of restarting drawing,
		// cut if new size is smaller, and add chars when larger
		// v
		init();
		// let xDiff = drawingWidth - xc;
		// let yDiff = drawingHeight - yc;

		// if (xc < drawingWidth) { // making window smaller
		// 	for (var i = 0; i < drawing.length; i++) {
		// 		console.log(xc)
		// 		drawing[i].slice(0, xc);
		// 	}

		// } else { // expanding window
		// 	for (var j = 0; j < drawing.length; j++) {
		// 		for (var i = 0; i < (xDiff * -1); i++) {
		// 			drawing[j] += backgroundChar;
		// 		}
		// 	}
		// }

		// if (yc < drawingHeight) {
		// 	drawing.slice(0, yc);

		// } else {
		// 	for (var i = 0; i < (yDiff * -1); i++) {
		// 		let str = ""
		// 		for (var  j = 0;  j < xc;  j++) {
		// 			str += backgroundChar
		// 		}
		// 		drawing.push(str);
		// 	}
		// }
		// drawingWidth = xc;
		// drawingHeight = yc;
		// display()
	};

	var fullscreen = function fullscreen() {
		var ww = $(window).width(),
		    wh = $(window).height();

		var charsX = Math.floor(ww / charD[0]),
		    charsY = Math.floor(wh / charD[1]);

		fullscreenSwitch = true;

		$(target).css({
			width: ww + 3 + "px", // not nice + 3
			height: wh + 3 + "px"
		});

		size(charsX, charsY);
	};

	var responsive = function responsive() {
		if (fullscreenSwitch) {
			window.onresize = function (event) {
				if (options.animated) {
					fullscreen();
				} else {
					fullscreen();
					display();
				}
				// console.log(drawing);

				// console.log(drawing);
				// display(target);
				// not responsive without animation, fix
			};
		}
	};

	var stroke = function stroke(char) {
		strokeChar = String(char);
	};

	var background = function background(char) {
		backgroundChar = String(char);
	};

	var point = function point(xc, yc) {
		var x = Math.floor(xc);
		var y = Math.floor(yc);

		// for (var i = 0; i < drawing[yc].length; i++) {
		// 	console.log();
		// }

		// console.log(drawing);

		if (x >= 0 && y >= 0 && x < drawingWidth && y < drawingHeight) {
			// drawing = drawing.replaceAt(getCoords(x,y), strokeChar);
			drawing[y] = drawing[y].replaceAt(x, strokeChar);
		}
	};

	var clearPoint = function clearPoint(xc, yc) {
		var prevStroke = strokeChar;
		stroke(backgroundChar);
		point(xc, yc);
		stroke(prevStroke);

		// let x = Math.floor(xc);
		// let y = Math.floor(yc);

		// if (x >= 0 && y >= 0 && x < drawingWidth && y < drawingHeight) {
		// 	// drawing = drawing.replaceAt(getCoords(x,y), strokeChar);
		// 	drawing[y] = drawing[y].replaceAt(x,backgroundChar);
		// }
	};

	var line = function line(x1, y1, x2, y2) {
		drawMidpoints([x1, y1], [x2, y2]);
	};

	var text = function text(string, x, y, dir) {
		var prevStroke = strokeChar;
		if (dir == null || dir == "horizontal") {
			for (var i = 0; i < string.length; i++) {
				stroke(string[i]);
				point(x + i, y);
			}
		} else if (dir == "vertical") {
			for (var _i = 0; _i < string.length; _i++) {
				stroke(string[_i]);
				point(x, y + _i);
			}
		}
		stroke(prevStroke);
	};

	// const colorText = (string, x, y, r, g, b, bgr, bgg, bgb) => {
	// 	text(string,x,y);

	// 	const tag = `<span style="background-color: rgb(${bgr},${bgg},${bgb}); color: rgb(${r},${g},${b});">`

	// 	drawing[y] = insertStr(drawing[y],tag,x);
	// 	drawing[y] = insertStr(drawing[y],"</span>",x + tag.length + string.length);
	// }

	var link = function link(url, string, x, y) {
		links.push({
			url: url,
			string: string,
			x: x,
			y: y
		});
	};

	var renderLink = function renderLink(url, string, x, y) {
		text(string, x, y);

		var tag = "<a href=\"" + url + "\" target=\"_blank\">";

		drawing[y] = insertStr(drawing[y], tag, x);
		drawing[y] = insertStr(drawing[y], "</a>", x + tag.length + string.length);
	};

	var strokeRect = function strokeRect(x, y, w, h) {
		for (var i = 0; i < w; i++) {
			point(x + i, y);
		}
		for (var _i2 = 0; _i2 < w; _i2++) {
			point(x + _i2, y - 1 + h);
		}
		for (var _i3 = 0; _i3 < h; _i3++) {
			point(x, y + _i3);
		}
		for (var _i4 = 0; _i4 < h; _i4++) {
			point(x + w - 1, y + _i4);
		}
	};

	var fillRect = function fillRect(xc, yc, w, h) {
		for (var j = 0; j < h; j++) {
			for (var i = 0; i < w; i++) {
				point(xc + i, yc + j);
			}
		}
	};

	var clearRect = function clearRect(x, y, w, h) {
		for (var j = 0; j < h; j++) {
			for (var i = 0; i < w; i++) {
				clearPoint(x + i, y + j);
			}
		}
	};

	var strokeEllipse = function strokeEllipse(x, y, w, h) {
		var cx = x + w / 2; // center
		var cy = y + h / 2;
		var rx = w / 2; // radius
		var ry = h / 2;

		for (var i = 0; i < 360; i++) {
			var xx = Math.floor(cx + rx * Math.cos(i));
			var yy = Math.floor(cy + ry * Math.sin(i));

			point(xx, yy);
		}
	};

	var fillEllipse = function fillEllipse(x, y, w, h) {
		for (var _i5 = 0; _i5 < w; _i5++) {
			strokeEllipse(x + _i5 / 2, y, w - _i5, h);
		}
		for (var i = 0; i < h; i++) {
			strokeEllipse(x, y + i / 2, w, h - i);
		}
	};

	var importAscii = function importAscii(str, x, y, ignoreChar, ignoreChar2, ignoreChar3) {
		var prevStroke = strokeChar;
		for (var j = 0; j < str.length; j++) {
			for (var i = 0; i < str[j].length; i++) {
				if (str[j][i] !== ignoreChar) {
					if (str[j][i] !== ignoreChar2) {
						if (str[j][i] !== ignoreChar3) {
							stroke(str[j][i]);
							point(x + i, y + j);
						}
					}
				}
			}
		}
		stroke(prevStroke);
	};

	var title = function title(fontName, string, x, y, spacingAdjust) {

		var fontData = titleFonts[fontName];

		var data = titleFonts[fontName];
		data = data.split("\n")[0];
		data = data.split(" ");

		var ignoreChar = data[0][5];

		var divisionChar = "@";

		var font = fontData.substring(fontData.indexOf(ignoreChar) + 1);
		font = font.substring(font.indexOf(ignoreChar) + 1);
		font = font.split(divisionChar + divisionChar);

		var xCoord = 0;

		var indOfChar = function indOfChar(char) {
			return char.charCodeAt(0) - 32;
		};

		var writeTitle = function writeTitle(str) {
			for (var i = 0; i < str.length; i++) {

				var char = font[indOfChar(str[i])];
				var charRows = char.split(divisionChar);
				for (var j = 0; j < charRows.length; j++) {
					charRows[j] += divisionChar;
					charRows[j] = charRows[j].replace(/(\r\n\t|\n|\r\t)/gm, ""); // REMOVE LINE BREAKS
					for (var k = 0; k < charRows[j].length; k++) {
						if (charRows[j][k].charCodeAt(0) < 32) {
							var pos = k;
							charRows[j] = charRows[j].slice(0, pos) + charRows[j].slice(pos + 1); // REMOVE WEIRDO CHARS
						}
					}
				}

				graver.importAscii(charRows, x + xCoord, y, ignoreChar, divisionChar, " ");

				if (spacingAdjust == null) {
					spacingAdjust = 0;
				}

				xCoord += charRows[1].length + spacingAdjust;
			}
		};

		writeTitle(string);
	};

	var clearAll = function clearAll() {
		clearRect(0, 0, drawingWidth, drawingHeight);
	};

	var width = function width() {
		return drawingWidth;
	};

	var height = function height() {
		return drawingHeight;
	};

	var display = function display() {

		var str = "";

		//// render linksssss
		var currentY = void 0;
		var compX = 0; // compensation for x coordinates, considering length of html <a> tags
		for (var i = 0; i < links.length; i++) {
			if (currentY == links[i].y) {
				var tag = "<a href=\"" + links[i - 1].url + "\" target=\"_blank\">" + links[i - 1].string + "</a"; // for some reason works with -1 len, so i removed last char. find solution
				console.log(tag);
				compX += tag.length;
			} else {
				compX = 0;
			}
			renderLink(links[i].url, links[i].string, links[i].x + compX, links[i].y);
			currentY = links[i].y;
		}
		/////////////////////

		for (var _i6 = 0; _i6 < drawing.length; _i6++) {
			var currentLine = drawing[_i6];
			str += currentLine + "<br>";
		}

		$(target).html(str);
	};

	loadFont(target);

	document.fonts.ready.then(function () {
		// console.log(`${font} loaded? ` + document.fonts.check(`1em ${font}`));  // should be true
		charD = getCharDimensions(target);
		init();
	});

	// init();

	return {
		loadTitleFont: loadTitleFont,
		size: size,
		fullscreen: fullscreen,
		responsive: responsive,
		stroke: stroke,
		background: background,
		point: point,
		clearPoint: clearPoint,
		line: line,
		text: text,
		// colorText: colorText,
		link: link,
		strokeRect: strokeRect,
		fillRect: fillRect,
		clearRect: clearRect,
		strokeEllipse: strokeEllipse,
		fillEllipse: fillEllipse,
		importAscii: importAscii,
		title: title,
		clearAll: clearAll,
		width: width,
		height: height,
		display: display
	};
};