


class Node {
	parent;
	index = 0;
	name;
	linesTo = [];
	linesFrom = [];

	get position() {
		return new Vector(0, 0);
	}

	value = false;
	calcValue() {
		this.value = this.linesTo.filter((line) => line.value).length > 0;
		return this.value;
	}


	constructor({index}, _parent) {
		this.index = index;
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
	isInput = true;
	get position() {
		let relVector = new Vector(
			0, 
			this.index * 50,
		);
		return this.parent.position.copy().add(relVector);
	}
}

class OutputNode extends Node {
	isOutput = true;
	get position() {
		let relVector = new Vector(
			this.parent.size.value[0], 
			this.index * 50,
		);
		if (this.parent) return this.parent.position.copy().add(relVector);
		return relVector;
	}
}






class WorldInputNode extends InputNode {
	get position() {
		return new Vector(
			50, 
			Math.random() * World.size.value[1]
		);
	}

	value = true;
	calcValue() {return this.value}
}


class WorldOutputNode extends OutputNode {
	get position() {
		return new Vector(
			World.size.value[0], 
			Math.random() * World.size.value[1]
		);
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




