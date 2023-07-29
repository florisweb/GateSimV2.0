


class Node {
	parent;
	index = 0;
	name;
	linesTo = [];
	linesFrom = [];

	get position() {
		return new Vector(0, 0);
	}

	get id() {
		let ownId = (this.isInput ? 'IN' : 'OUT') + this.index;
		return this.parent.id + '|' + ownId;
	}


	value = false;
	calcValue() {
		this.value = this.linesTo.filter((line) => line.value).length > 0;
		return this.value;
	}


	constructor({index, name}, _parent) {
		this.index = index;
		this.name = name;
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
		let pos = super.position;
		pos.value[0] = 50;
		return pos;
	}

	value = true;
	calcValue() {return this.value}
}


class WorldOutputNode extends OutputNode {
	get position() {
		let pos = super.position;
		pos.value[0] = World.size.value[0];
		return pos;
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

	serialize() {
		return {
			type: 'LINE',
			from: this.fromNode.id,
			to: this.toNode.id,
		}
	}
}




