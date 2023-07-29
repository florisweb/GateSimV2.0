
class BaseComponent {
	parent;
	relativePosition = new Vector(0, 0);
	size = new Vector(100, 100);


	get position() {
		if (this.parent) return this.parent.position.copy().add(this.relativePosition);
		return this.relativePosition.copy();
	}

	inputs = [];
	outputs = [];

	constructor({relPos}, _parent) {
		this.parent = _parent;
		this.relativePosition = relPos;
	}
}




class Component {


	constructor({relPos, content, inputCount, outputCount}, _parent) {




	}
}

















class NandGate extends BaseComponent {
	inputs = [
		new NandInputNode({index: 0}, this),
		new NandInputNode({index: 1}, this),
	];
	outputs = [
		new NandOutputNode({index: 0}, this)
	];

	constructor() {
		super({
			relPos: new Vector(
				.5 * World.size.value[0],
				.5 * World.size.value[1]
			)
		})

	}
}
















class NandOutputNode extends Node {
	value = false;
	name = 'NandOutput';
	get position() {
		return this.parent.position.copy().add(new Vector(30, 0));
	}
	calcValue() {
		this.value = !(this.parent.inputs[0].value && this.parent.inputs[1].value);
		return this.value;
	}
}

class NandInputNode extends Node {
	get position() {
		let isFirstInput = this.parent.inputs[0] === this;
		return this.parent.position.copy().add(new Vector(-30, isFirstInput ? -50 : 50));
	}

	constructor() {
		super(...arguments);
		wait(0).then(() => this.name = 'NandInput ' + (this.parent.inputs[0] === this ? 'A' : 'B'));
	}


	evaluatePaths(_evalStrand = []) {
		super.evaluatePaths(_evalStrand);
		this.parent.outputs[0].evaluatePaths(_evalStrand);
	}
}






















