


class Node {
	parent;
	name;
	linesTo = [];
	linesFrom = [];


	_position = new Vector(0, 0);
	get position() {
		return this._position;
	}

	value = false;
	calcValue() {
		this.value = this.linesTo.filter((line) => line.value).length > 0;
		return this.value;
	}


	constructor(_parent, _position) {
		this.parent = _parent;
		World.nodes.push(this);
	}

	hasAddedLoopPath = false;
	evaluatePaths(_curPath = []) {
		if (_curPath.includes(this))
		{
			Runner.registerPathEnd(_curPath);
			if (this.hasAddedLoopPath) return;
			this.hasAddedLoopPath = true;
			this.evaluatePaths([]);
			return;
		}

		_curPath.push(this);

		if (this instanceof NandInputNode) return;
		if (this.linesFrom.length === 0) return Runner.registerPathEnd(_curPath);

		for (let line of this.linesFrom)
		{
			let newPath = Object.assign([], _curPath);
			line.toNode.evaluatePaths(newPath);
		}
	}
}


class InputNode extends Node {
	value = true;
	calcValue() {return this.value}

	constructor() {
		super();
		this._position.value[0] = 50;
		this._position.value[1] = Math.random() * World.size.value[1];
	}
}


class OutputNode extends Node {
	constructor() {
		super();
		this._position.value[0] = World.size.value[0];
		this._position.value[1] = Math.random() * World.size.value[1];
	}
}













class Line {
	get value() {
		return this.fromNode.value;
	}
	fromNode;
	toNode;
	constructor(from, to) {
		this.fromNode = from;
		this.toNode = to;
		this.fromNode.linesFrom.push(this);
		this.toNode.linesTo.push(this);
		World.lines.push(this);
	}
}




