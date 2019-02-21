const graverLib = (target) => {
	let drawingWidth = 40;
	let drawingHeight = 20;
	let drawing = [];
	let strokeChar = `/`;
	let backgroundChar = ` `;
	let fullscreenSwitch = false;
	let titleFonts = {};
	let links = [];
	let charD = [12,20];

	let options = {
		animated: false
	}

	let font = $(target).css("font-family");

	const loadFont = (target) => {
		$(target).append(`<span id="tempInitFont" style="opacity:0;">asd</span>`);
	}

	const getCharDimensions = (target) => {
		let dimensions = [0,0];
		const char = 'X';
		$(target).prepend(`<div id="tempMeasure" style="position:fixed;"></div>`);
		$("#tempMeasure").append(`${char}<div class='measureChar' id='measureCharX' style='background-color: lime;'>${char}</div><br><div class='measureChar' id='measureCharY' style='background-color: blue;'>${char}</div><br>`);
		dimensions[0] = $("#measureCharX").position().left;
		dimensions[1] = $("#measureCharY").position().top;

		$("#tempMeasure").remove();
		$("#tempInitFont").remove();
		return dimensions;
	}

	const init = () => {
		drawing = [];
		for (let i = 0; i < drawingHeight; i++) {
			drawing.push("");
			for (let j = 0; j < drawingWidth; j++) {
				drawing[i] += backgroundChar;
			}
		}
	}

	const arraysEqual = (arr1, arr2) => {
	    if(arr1.length !== arr2.length) {
	        return false;
	    }
	    for(var i = arr1.length; i--;) {
	        if(arr1[i] !== arr2[i]) {
	            return false;
	        }
	    }
	    return true;
	}

	String.prototype.replaceAt=function(index, replacement) {
	    return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
	}

	String.prototype.splice = function(idx, rem, str) {
	    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
	};

	const midpoint = (a, b) => {
	    return Math.floor((a + b) / 2);
	}

	const drawMidpoints = (p0, p1) => {
	    let middle = [midpoint(p0[0], p1[0]), midpoint(p0[1], p1[1])];
	    point(middle[0],middle[1])
	    if ((p0[0] !== middle[0] || p0[1] !== middle[1]) && (p1[0] !== middle[0] || p1[1] !== middle[1])) {
	        drawMidpoints(p0, middle);
	        drawMidpoints(middle, p1);
	    }
	}

	const insertStr = (targetStr, str, pos) => {
		if (targetStr !== undefined) {
			if (pos < targetStr.length -1) {
				var output = [targetStr.slice(0, pos), str, targetStr.slice(pos)].join('');
				return output;
			} else {
				return targetStr;
			}
		}
	}

	// USER FUNCTIONS //
	function loadTitleFont() {

		const load = (arg) => {
			let font = arg;
			const fontName = `${font}.flf`;
			var xhttp = new XMLHttpRequest();
			let fontFile;

			xhttp.onreadystatechange = function() {
			    if (this.readyState == 4 && this.status == 200) {
			    	fontFile = xhttp.responseText;
					titleFonts[font] = fontFile;
			    }
			};

			xhttp.open("GET", `/titleFonts/${fontName}`, true);
			xhttp.send();
		}

		for (var i = 0; i < arguments.length - 1; i++) {
			load(arguments[i]);
		}

		//callback to render stuff after fonts are loaded
		const callback = arguments[arguments.length-1];
		if (typeof(callback) == 'function') {
	        callback();
	    }
	}

	const size = (xc, yc) => {
		drawingWidth = xc;
		drawingHeight = yc;
		init();
	}

	const fullscreen = () => {
		let ww = $(window).width(),
			wh = $(window).height();

		let charsX = Math.floor(ww / charD[0]),
			charsY = Math.floor(wh / charD[1]);

		fullscreenSwitch = true;

		$(target).css({
			width: `${ ww + 3 }px`, // not nice + 3
			height: `${ wh + 3 }px`
		});

		size(charsX, charsY);
	}

	const responsive = () => {
		if (fullscreenSwitch) {
			window.onresize = function(event) {
				if (options.animated) {
					fullscreen();
				} else {
					fullscreen()
					display()
				}
			};
		}	
	}

	const stroke = (char) => {
		strokeChar = String(char);
	}

	const background = (char) => {
		backgroundChar = String(char);
	}

	const point = (xc,yc) => {
		let x = Math.floor(xc);
		let y = Math.floor(yc);


		if (x >= 0 && y >= 0 && x < drawingWidth && y < drawingHeight) {
			drawing[y] = drawing[y].replaceAt(x,strokeChar);
		}
	}

	const clearPoint = (xc,yc) => {
		let prevStroke = strokeChar;
		stroke(backgroundChar);
		point(xc, yc);
		stroke(prevStroke);
	}

	const line = (x1,y1,x2,y2) => {
		drawMidpoints([x1,y1], [x2, y2]);
	}

	const text = (string,x,y,dir) => {
		let prevStroke = strokeChar;
		if (dir == null || dir == "horizontal"){
			for (let i = 0; i < string.length; i++) {
				stroke(string[i]);
				point(x+i,y);
			}
		} else if (dir == "vertical") {
			for (let i = 0; i < string.length; i++) {
				stroke(string[i]);
				point(x,y+i);
			}
		}
		stroke(prevStroke);
	}

	const link = (url,string,x,y) => {
		links.push({
			url: url,
			string: string,
			x: x,
			y: y
		});
	}

	const renderLink = (url,string,x,y) => {
		text(string,x,y);

		const tag = `<a href="${url}" target="_blank">`

		drawing[y] = insertStr(drawing[y],tag,x);
		drawing[y] = insertStr(drawing[y],"</a>",x + tag.length + string.length);
	}

	const strokeRect = (x,y,w,h) => {
		for (let i = 0; i < w; i++) {
			point(x+i,y);
		}
		for (let i = 0; i < w; i++) {
			point(x+i,y-1+h);
		}
		for (let i = 0; i < h; i++) {
			point(x,y+i);
		}
		for (let i = 0; i < h; i++) {
			point(x+w-1,y+i);
		}
	}

	const fillRect = (xc,yc,w,h) => {
		for (let j = 0; j < h; j++) {
			for (let i = 0; i < w; i++) {
				point(xc+i,yc+j);
			}
		}	
	}

	const clearRect = (x,y,w,h) => {
		for (let j = 0; j < h; j++) {
			for (let i = 0; i < w; i++) {
				clearPoint(x+i,y+j);
			}
		}	
	}
	
	const strokeEllipse = (x,y,w,h) => {
		let cx = x+w/2; // center
		let cy = y+h/2;
		let rx = w/2; // radius
		let ry = h/2;

		for (let i = 0; i < 360; i++) {
			let xx = Math.floor(cx + rx * Math.cos(i));
			let yy = Math.floor(cy + ry * Math.sin(i));
			
			point(xx,yy);
		}
	}

	const fillEllipse = (x,y,w,h) => {
		for (let i = 0; i < w; i++) {
			strokeEllipse(x+i/2,y,w-i,h);
		}
		for (var i = 0; i < h; i++) {
			strokeEllipse(x,y+i/2,w,h-i);
		}
	}

	const importAscii = (str,x,y,ignoreChar, ignoreChar2, ignoreChar3) => {
		let prevStroke = strokeChar;
		for (let j = 0; j < str.length; j++) {
			for (let i = 0; i < str[j].length; i++) {
				if (str[j][i] !== ignoreChar) {
					if (str[j][i] !== ignoreChar2) {
						if (str[j][i] !== ignoreChar3) {
							stroke(str[j][i])
							point(x+i,y+j);
						}
					}
				}
			}
		}
		stroke(prevStroke);	
	}

	const title = (fontName, string, x, y, spacingAdjust) => {

		let fontData = titleFonts[fontName];

		let data = titleFonts[fontName];
			data = data.split("\n")[0];
	    	data = data.split(" ");

		let ignoreChar = data[0][5];

		let divisionChar = "@";

		let font = fontData.substring(fontData.indexOf(ignoreChar) + 1);
			font = font.substring(font.indexOf(ignoreChar) + 1);
			font = font.split(divisionChar+divisionChar);


		let xCoord = 0;

		const indOfChar = (char) => {
		    return char.charCodeAt(0) - 32;
		}

		const writeTitle = (str) => {
		    for (var i = 0; i < str.length; i++) {

		        let char = font[ indOfChar(str[i]) ];
		        let charRows = char.split(divisionChar);
		        for (var j = 0; j < charRows.length; j++) {
		        	charRows[j] += divisionChar;
		        	charRows[j] = charRows[j].replace(/(\r\n\t|\n|\r\t)/gm,""); // REMOVE LINE BREAKS
		        	for (var k = 0; k < charRows[j].length; k++) {
		        		if (charRows[j][k].charCodeAt(0) < 32) {
					        var pos = k;
							charRows[j] = charRows[j].slice(0, pos) + charRows[j].slice(pos+1); // REMOVE WEIRDO CHARS
		        		}
		        	}
		        }
		        
		        graver.importAscii(charRows, x + xCoord, y, ignoreChar, divisionChar, " ");
		        
				if (spacingAdjust == null){ spacingAdjust = 0; }	

		        xCoord += charRows[1].length + spacingAdjust;
		    }
		}

		writeTitle(string);
	}

	const clearAll = () => {
		clearRect(0,0,drawingWidth,drawingHeight);
	}

	const width = () => {
		return drawingWidth;
	}

	const height = () => {
		return drawingHeight;
	}

	const display = () => {
		
		let str = "";

		let currentY;
		let compX = 0; // compensation for x coordinates, considering length of html <a> tags
		for (var i = 0; i < links.length; i++) {
			if (currentY == links[i].y) {
				let tag = `<a href="${links[i-1].url}" target="_blank">${links[i-1].string}</a`; // for some reason works with -1 len, so i removed last char. find solution
				console.log(tag);
				compX += tag.length;
			} else {
				compX = 0;
			}
			renderLink(links[i].url, links[i].string, links[i].x + compX, links[i].y);
			currentY = links[i].y;
		}

		for (let i = 0; i < drawing.length; i++) {
			let currentLine = drawing[i];
			str += currentLine+"<br>";
		}

		$(target).html(str);
	}

	loadFont(target);
	
	document.fonts.ready.then(function () {
		charD = getCharDimensions(target);
		init();
	});

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
	}	
}
