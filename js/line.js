
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
	}

	serialize() {
		return {
			type: 'Line',
			fromId: this.fromNode.id,
			toId: this.toNode.id,
		}
	}
}




class BuildLine {
	get value() {
		return this.fromNode.value;
	}
	fromNode;
	toNode;

	constructor(from) {
		console.warn(...arguments);
		this.fromNode = from;
		this.toNode = new class {
			linesTo = [];
			get position() {
				return Builder.curMousePos;
			}
		}
	}
}




