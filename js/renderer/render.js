
class _Renderer {
	canvas = canvas;
	#ctx;
	camera;
	constructor() {
		this.#ctx = this.canvas.getContext('2d');
		this.camera = new _Camera();
	}
	setup() {
		window.onresize();
	}


	render() {
		this.#ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.renderLines();
		this.renderNodes();
		requestAnimationFrame(() => this.render());
	}


	

	renderNodes() {
		for (let node of World.nodes)
		{
			this.#drawCircle({
				position: node.position,
				radius: 20, 
				fillColor: node.value ? '#f00' : '#333',
				strokeColor: '#aaa'
			});
			this.#drawCenteredText({
				text: node.name,
				position: node.position.copy().add(new Vector(0, 30)),
				color: '#eee',
				fontSize: 15
			})
		}
	}	


	renderLines() {
		for (let line of World.lines)
		{
			this.#drawTraceLine({
				start: line.fromNode.position,
				end: line.toNode.position,
				color: line.value ? '#f00' : '#ccc',
			});
		}
	}



	#drawCircle({position, radius, fillColor, strokeColor}) {
		if (fillColor) this.#ctx.fillStyle = fillColor;
		if (strokeColor) this.#ctx.strokeStyle = strokeColor;

		let canvPos = this.camera.worldPosToCanvPos(position);
		let canvRadius = radius / this.camera.zoom;

		this.#ctx.beginPath();
		this.#ctx.ellipse(
			canvPos.value[0],
			canvPos.value[1],
			canvRadius,
			canvRadius,
			0,
			0,
			2 * Math.PI
		);
		this.#ctx.closePath();

		if (fillColor) this.#ctx.fill();
		if (strokeColor) this.#ctx.stroke();
	}

	#drawLine({start, end, color}) {
		if (color) this.#ctx.strokeStyle = color;
		let startPos = this.camera.worldPosToCanvPos(start);
		let endPos = this.camera.worldPosToCanvPos(end);

		this.#ctx.beginPath();
		this.#ctx.moveTo(startPos.value[0], startPos.value[1])
		this.#ctx.lineTo(endPos.value[0], endPos.value[1])
		this.#ctx.closePath()
		if (color) this.#ctx.stroke();
	}



	#drawTraceLine({start, end, color}) {
		let dx = end.value[0] - start.value[0];
		let dy = end.value[1] - start.value[1];

		let b = .1 * dx;
		let bx = .5 * Math.sqrt(2) * b;
		let yModifier = (dy < 0 ? -1 : 1);
		if (dx < 0) yModifier *= -1;
		let by = .5 * Math.sqrt(2) * b * yModifier;
		
		let a = (dx - bx * 2) / 2;
		let c = (dy - by * 2);


		let subPos = start.copy().add(new Vector(a, 0));
		this.#drawLine({start: start, end: subPos, color: color});

		let subPos2 = subPos.copy().add(new Vector(bx, by));
		this.#drawLine({start: subPos, end: subPos2, color: color});

		let subPos3 = subPos2.copy().add(new Vector(0, c));
		this.#drawLine({start: subPos2, end: subPos3, color: color});

		let subPos4 = subPos3.copy().add(new Vector(bx, by));
		this.#drawLine({start: subPos3, end: subPos4, color: color});

		let subPos5 = subPos4.copy().add(new Vector(a, 0));
		this.#drawLine({start: subPos4, end: subPos5, color: color});
	}



	#drawCenteredText({text, position, fontSize, color}) {
		this.#ctx.textAlign = 'center';
		this.#drawText(...arguments);
		this.#ctx.textAlign = 'start';
	}


	#drawText({text, position, fontSize, color, alignRight = false}) {
		this.#ctx.textBaseline = 'middle';
		if (alignRight) ctx.textAlign = 'end';
		let canvPos = this.camera.worldPosToCanvPos(position);
		let canvFontSize = fontSize / this.camera.zoom;

		this.#ctx.fillStyle = color;
		this.#ctx.font = canvFontSize + "px Arial";
		this.#ctx.beginPath();
		this.#ctx.fillText(text, canvPos.value[0], canvPos.value[1]);
		this.#ctx.closePath();
		this.#ctx.fill();		
	}
}






window.onresize = function() {
	Renderer.canvas.width = Renderer.canvas.offsetWidth;
	Renderer.canvas.height = Renderer.canvas.offsetHeight;
	Renderer.camera.onResize();
}

