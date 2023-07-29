
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
			type: 'Line',
			fromId: this.fromNode.id,
			toId: this.toNode.id,
		}
	}
}




