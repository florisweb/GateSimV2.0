
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

	remove() {
		let indexA = this.fromNode.linesFrom.findIndex((line) => line === this);
		let indexB = this.toNode.linesTo.findIndex((line) => line === this);

		this.fromNode.linesFrom.splice(indexA, 1);
		this.toNode.linesTo.splice(indexB, 1);

		// TODO also check for lines in other components, not just the world component
		let indexC = World.component.content.findIndex((item) => item === this);
		World.component.content.splice(indexC, 1);
	}
}




class BuildLine {
	get value() {
		return this.fromNode.value;
	}
	fromNode;
	toNode;

	constructor(from) {
		this.fromNode = from;
		this.toNode = new class {
			linesTo = [];
			get position() {
				return Builder.curMousePos;
			}
		}
	}
}




