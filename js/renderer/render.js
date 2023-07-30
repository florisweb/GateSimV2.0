
class _Renderer {
	NodeSize = 15;
	NodeMargin = 70;



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

		World.component.content.sort((a, b) => a instanceof Line ? 1 : b instanceof Line ? -1 : 0);
		for (let item of World.component.content)
		{
			if (item instanceof NandGate || item instanceof Component)
			{
				this.renderComponent(item);
			} else if (item instanceof Line) 
			{
				this.renderLine(item);
			}
		}
		this.renderWorldNodes();


		for (let line of Builder.buildLines)
		{
			this.renderLine(line);
		}

		requestAnimationFrame(() => this.render());
	}


	renderWorldNodes() {
		let nodes = [...World.component.inputs, ...World.component.outputs]
		for (let node of nodes) 
		{
			this.renderNode(node);
			if (!node.toggleButton) continue;
			this.renderToggleButton(node.toggleButton);
		}
	}	


	renderLine(_line) {
		this.#drawTraceLine({
			start: _line.fromNode.position,
			end: _line.toNode.position,
			color: _line.value ? '#f00' : '#ccc',
		});
	}

	renderComponent(_comp) {
		this.#drawRect({
			position: _comp.position,
			diagonal: _comp.size,
			fillColor: _comp.selected ? '#335' : '#333',
			strokeColor: '#777'
		});

		let nodes = [..._comp.inputs, ..._comp.outputs];
		for (let node of nodes) this.renderNode(node);

		this.#drawCenteredText({
			text: _comp.name,
			position: _comp.position.copy().add(_comp.size.copy().scale(.5)),
			color: '#fff',
			fontSize: 20
		})
	}

	renderNode(_node) {
		this.#drawCircle({
			position: _node.position,
			radius: this.NodeSize, 
			fillColor: _node.value ? (_node.selected ? '#c03' : '#f00') : (_node.selected ? '#335' : '#333'),
			strokeColor: '#aaa',
		});
		this.#drawCenteredText({
			text: _node.name,
			position: _node.position.copy().add(new Vector(0, this.NodeSize * 1.5)),
			color: '#eee',
			fontSize: 15
		});
	}

	renderToggleButton(_button) {
		this.#drawRect({
			position: _button.position,
			diagonal: _button.size,
			fillColor: '#333',
			strokeColor: '#777'
		});
		this.#drawCenteredText({
			text: "TOGGLE",
			position: _button.position.copy().add(_button.size.copy().scale(.5)),
			color: '#eee',
			fontSize: 10
		})
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

	#drawRect({position, diagonal, fillColor, strokeColor}) {
		if (fillColor) this.#ctx.fillStyle = fillColor;
		if (strokeColor) this.#ctx.strokeStyle = strokeColor;

		let canvStartPos = this.camera.worldPosToCanvPos(position);
		let canvEndPos = this.camera.worldPosToCanvPos(position.copy().add(diagonal));
		let delta = canvStartPos.difference(canvEndPos);

		this.#ctx.beginPath();
		this.#ctx.rect(
			canvStartPos.value[0],
			canvStartPos.value[1],
			delta.value[0],
			delta.value[1]
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


	#sqrt2 = Math.sqrt(2);
	#drawTraceLine({start, end, color}) {
		let dx = end.value[0] - start.value[0];
		let dy = end.value[1] - start.value[1];

		let b = .1 * dx;

		if (Math.abs(dy) < Math.abs(this.#sqrt2 * b))
		{
			b = dy / 2 * this.#sqrt2;
			if (dy < 0) b *= -1;
			if (dx < 0) b *= -1;
		}

		let bx = .5 * this.#sqrt2 * b;
		let yModifier = (dy < 0 ? -1 : 1);
		if (dx < 0) yModifier *= -1;
		let by = .5 * this.#sqrt2 * b * yModifier;

		
		let a = (dx - bx * 2) / 2;
		let c = (dy - by * 2);


		let subPos = start.copy().add(new Vector(a, 0));
		let subPos2 = subPos.copy().add(new Vector(bx, by));
		let subPos3 = subPos2.copy().add(new Vector(0, c));
		let subPos4 = subPos3.copy().add(new Vector(bx, by));
		let subPos5 = subPos4.copy().add(new Vector(a, 0));

		let points = [
			start,
			subPos,
			subPos2,
			subPos3,
			subPos4,
			subPos5
		];

		let canvPoints = points.map(p => this.camera.worldPosToCanvPos(p));
		if (color) this.#ctx.strokeStyle = color;

		this.#ctx.beginPath();
		this.#ctx.moveTo(canvPoints[0].value[0], canvPoints[0].value[1]);
		for (let i = 1; i < canvPoints.length; i++)
		{
			this.#ctx.lineTo(canvPoints[i].value[0], canvPoints[i].value[1])
		}
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

