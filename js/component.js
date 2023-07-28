



class NandGate {
	position = new Vector(
		.5 * World.size.value[0],
		.5 * World.size.value[1]
	);
	inputs = [
		new NandInputNode(this),
		new NandInputNode(this),
	];
	outputs = [
		new NandOutputNode(this)
	];
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






















