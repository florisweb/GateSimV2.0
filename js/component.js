
class BaseComponent {
	type = '';
	parent;
	relativePosition = new Vector(0, 0);
	size = new Vector(100, 100);
	id = newId();


	get position() {
		if (this.parent) return this.parent.position.copy().add(this.relativePosition);
		return this.relativePosition.copy();
	}

	inputs = [];
	outputs = [];

	constructor({relPos, id} = {}, _parent) {
		this.parent = _parent;
		if (relPos) this.relativePosition = relPos;
		if (id) this.id = id;
	}


	serialize() {
		return {
			id: this.id,
			type: this.type,
			relativePosition: this.relativePosition.value,
			inputs: this.inputs.map(inp => {name: inp.name}),
			outputs: this.outputs.map(out => {name: out.name}),
		}
	}
}




class Component extends BaseComponent {
	type = 'CustomComponent';
	content = [];

	constructor({relPos, content, inputs, outputs} = {relPos: new Vector(0, 0), content: [], inputs: [], outputs: []}, _parent) {
		super(...arguments);
		for (let i = 0; i < inputs.length; i++) this.inputs.push(new InputNode({index: i, name: inputs[i].name}, this));
		for (let i = 0; i < outputs.length; i++) this.outputs.push(new OutputNode({index: i, name: outputs[i].name}, this));
		this.content = content;
	}

	serialize() {
		let base = super.serialize();
		let content = this.content.map(c => c.serialize());
		base.content = content;
		return base;
	}
}

















class NandGate extends BaseComponent {
	type = 'NAND';
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
		});
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






















