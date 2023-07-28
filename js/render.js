
const Renderer = new class {
	canvas = canvas;
	#ctx;
	constructor() {
		this.#ctx = this.canvas.getContext('2d');
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
			this.#drawLine({
				start: line.fromNode.position,
				end: line.toNode.position,
				color: line.value ? '#f00' : '#ccc',
			});
		}
	}



	#drawCircle({position, radius, fillColor, strokeColor}) {
		if (fillColor) this.#ctx.fillStyle = fillColor;
		if (strokeColor) this.#ctx.strokeStyle = strokeColor;

		this.#ctx.beginPath();
		this.#ctx.ellipse(
			position.value[0],
			position.value[1],
			radius,
			radius,
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
		this.#ctx.beginPath();
		this.#ctx.moveTo(start.value[0], start.value[1])
		this.#ctx.lineTo(end.value[0], end.value[1])
		this.#ctx.closePath()
		if (color) this.#ctx.stroke();
	}



	#drawCenteredText({text, position, fontSize, color}) {
		this.#ctx.textAlign = 'center';
		this.#drawText(...arguments);
		this.#ctx.textAlign = 'start';
	}


	#drawText({text, position, fontSize, color, alignRight = false}) {
		this.#ctx.textBaseline = 'middle';
		if (alignRight) ctx.textAlign = 'end';

		this.#ctx.fillStyle = color;
		this.#ctx.font = fontSize + "px Arial";
		this.#ctx.beginPath();
		this.#ctx.fillText(text, position.value[0], position.value[1]);
		this.#ctx.closePath();
		this.#ctx.fill();		
	}
}