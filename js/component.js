
class BaseComponent {
	type = '';
	parent;
	relativePosition = new Vector(0, 0);
	size = new Vector(100, 100);
	id = newId();
	name = '';
	

	// UI Aspects
	hitBox;
	get selected() {
		return Builder.selectedItems.findIndex((item) => item.id === this.id) !== -1;
	}
	get masterParent() {
		if (this.parent) return this.parent.masterParent;
		return this;
	}
	get depth() {
		if (this.parent) return this.parent.depth + 1;
		return 0;
	}




	get indexInParentContext() {
		if (!this.parent) return -1;
		return this.parent.content.findIndex((item) => item === this);
	}

	get position() {
		if (this.parent) return this.parent.position.copy().add(this.relativePosition);
		return this.relativePosition.copy();
	}
	inputs = [];
	outputs = [];


	constructor({relativePosition, name} = {}) {
		if (relativePosition) this.relativePosition = relativePosition;
		this.name = name;
		this._setup(...arguments);
	}
	
	_setup() {
		this.hitBox = new RectangularHitBox({diagonal: this.size}, this);
	}

	setParent(_parent) {
		this.parent = _parent;
		
		if (!(this.masterParent instanceof WorldComponent)) return;
		if (this.depth > 1) return;
		this.hitBox.enable();
		let nodes = [...this.inputs, ...this.outputs];
		for (let node of nodes) node.hitBox.enable();
	}





	serialize() {
		return {
			type: this.type,
			relativePosition: this.relativePosition.value,
			inputs: this.inputs.map((inp) => {return {name: inp.name}}),
			outputs: this.outputs.map((out) => {return {name: out.name}}),
		}
	}

	_getNodeByLocalNodeId(_localNodeId) {
		let isInput = _localNodeId.substr(0, 2) === "IN";
		let index = isInput ? parseInt(_localNodeId.substr(2, 1000)) : parseInt(_localNodeId.substr(3, 1000));

		if (isInput) return this.inputs[index];
		return this.outputs[index];
	}


	remove() {
		let index = this.indexInParentContext;
		if (index !== -1) this.parent.content.splice(index, 1);
		
		let lines = [];
		for (let input of this.inputs) lines = lines.concat(input.linesTo);
		for (let output of this.outputs) lines = lines.concat(output.linesFrom);
		for (let line of lines) line.remove();

		this.hitBox.remove();
		let nodes = [...this.inputs, ...this.outputs];
		for (let node of nodes) node.hitBox.remove();


		if (!this.selected) return;
		Builder.selectedItems.splice(Builder.selectedItems.findIndex(item => item.id === this.id), 1);
	}
}




class Component extends BaseComponent {
	type = 'CustomComponent';
	componentId;
	content = [];

	constructor({id, componentId, relativePosition, content, inputs, outputs} = {relativePosition: new Vector(0, 0), content: [], inputs: [], outputs: []}) {
		super(...arguments);
		this.content = content;
		for (let child of this.content)
		{
			if (child instanceof Line) continue;
			child.setParent(this);
		}
		this.componentId = componentId;
	}
	_setup({inputs, outputs} = {}) {
		super._setup(...arguments);
		for (let i = 0; i < inputs.length; i++) this.inputs.push(new InputNode({index: i, name: inputs[i].name}, this));
		for (let i = 0; i < outputs.length; i++) this.outputs.push(new OutputNode({index: i, name: outputs[i].name}, this));
		
		this.size.value[0] = Math.max(100, Math.min(400, this.name.length * 10 + 40 + 2 * Renderer.NodeSize));
		this.size.value[1] = Math.max(inputs.length, outputs.length) * (Renderer.NodeSize + Renderer.NodeMargin);
	}

	serialize(_asReference = false) {
		if (_asReference) return {
			type: 'CustomComponent',
			componentId: this.componentId,
			relativePosition: this.relativePosition,
			isReference: true,
		};

		let base = super.serialize();
		base.componentId = this.componentId;
		let content = this.content.map(c => c.serialize(true));
		base.content = content;
		return base;
	}

	getNodeById(_nodeId) {
		let [parentCIId, localNodeId] = _nodeId.split('|');
		let index = parseInt(parentCIId.substr(2, 1000));
		if (index === -1)
		{
			return this._getNodeByLocalNodeId(localNodeId);
		}

		let targetChild = this.content[index];
		return targetChild._getNodeByLocalNodeId(localNodeId);
	}


	addComponent(_comp) {
		this.content.push(_comp);
		_comp.setParent(this);
	}
}














class WorldComponent extends Component {
	type = 'WorldComponent';
	get size() {
		return World.size;
	}

	_setup({inputs, outputs} = {inputs: [], outputs: []}) {
		for (let i = 0; i < inputs.length; i++) this.inputs.push(new WorldInputNode({index: i, name: inputs[i].name}, this));
		for (let i = 0; i < outputs.length; i++) this.outputs.push(new WorldOutputNode({index: i, name: outputs[i].name}, this));
	}

	setFromComponent(_component) {
		for (let key in _component)
		{
			this[key] = _component[key];
		}
		for (let child of this.content) 
		{
			if (child.type !== 'line') continue;
			child.setParent(this);
		}
	}
}


class NandGate extends BaseComponent {
	type = 'Nand';
	name = 'NandGate';
	inputs = [
		new NandInputNode({index: 0}, this),
		new NandInputNode({index: 1}, this),
	];
	outputs = [
		new NandOutputNode({index: 0}, this)
	];

	constructor({relativePosition} = {relativePosition: new Vector(0, 0)}) {
		super(...arguments);
		this.size.value = [170, 120]; // Set its value to keep the references intact
	}
}




class NandOutputNode extends OutputNode {
	value = false;
	name = 'NandIN';
	calcValue() {
		this.value = !(this.parent.inputs[0].value && this.parent.inputs[1].value);
		return this.value;
	}
}

class NandInputNode extends InputNode {
	constructor() {
		super(...arguments);
		wait(0).then(() => this.name = 'NandOUT ' + (this.parent.inputs[0] === this ? 'A' : 'B'));
	}
	evaluatePaths(_evalStrand = []) {
		super.evaluatePaths(_evalStrand);
		this.parent.outputs[0].evaluatePaths(_evalStrand);
	}
}






















