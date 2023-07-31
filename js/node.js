


class Node {
	isNode = true;
	
	parent;
	index = 0;
	name;
	linesTo = [];
	linesFrom = [];
	

	// UI Aspects
	hitBox;
	get selected() {
		return Builder.selectedItems.findIndex((item) => item.id === this.id) !== -1;
	}




	get position() {
		return new Vector(0, 0);
	}

	get id() {
		let ownId = (this.isInput ? 'IN' : 'OUT') + this.index;
		return 'CI' + this.parent.indexInParentContext + '|' + ownId;
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

		this.hitBox = new CircularHitBox({radius: Renderer.NodeSize}, this);
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
		let sisterNodeCount = this.parent.inputs.length;
		let deltaFromCenter = this.index - (sisterNodeCount - 1) / 2;
		let relVector = new Vector(
			0, 
			this.parent.size.value[1] / 2 + deltaFromCenter * Renderer.NodeMargin,
		);
		return this.parent.position.copy().add(relVector);
	}
}

class OutputNode extends Node {
	isOutput = true;
	get position() {
		let sisterNodeCount = this.parent.outputs.length;
		let deltaFromCenter = this.index - (sisterNodeCount - 1) / 2;

		let relVector = new Vector(
			this.parent.size.value[0], 
			this.parent.size.value[1] / 2 + deltaFromCenter * Renderer.NodeMargin,
		);
		if (this.parent) return this.parent.position.copy().add(relVector);
		return relVector;
	}
}






class WorldInputNode extends InputNode {
	toggleButton = new ToggleInputButton(this);
	get position() {
		let pos = super.position;
		pos.value[0] = 0;
		return pos;
	}

	value = true;
	calcValue() {return this.value}
	constructor() {
		super(...arguments);
		this.hitBox.enable();
		this.toggleButton.hitBox.enable();
	}

}



class WorldOutputNode extends OutputNode {
	get position() {
		let pos = super.position;
		pos.value[0] = World.component. size.value[0];
		return pos;
	}
	constructor() {
		super(...arguments);
		this.hitBox.enable();
	}
}




class Button {
	_parent;
	type = 'button';
	hitBox;

	get position() {
		return new Vector(0, 0);
	}

	constructor(_parent) {
		this._parent = _parent;
	}

	onClick() {}
}




class ToggleInputButton extends Button {
	size = new Vector(60, 25);
	offset = new Vector(-30, 25 / 2);

	get position() {
		return this._parent.position.copy().add(this.offset).add(this.size.copy().scale(-1));
	}

	constructor(_parent) {
		super(_parent);
		this.hitBox = new RectangularHitBox({diagonal: this.size}, this);
	}
	onClick() {
		this._parent.value = !this._parent.value;
		Runner.runViaPaths();
	}
}

class ChangeNodeCountButton extends Button {
	radius = Renderer.NodeSize;
	isAddButton = true;
	#isInputButton = false;

	get position() {
		let nodeCount = World.component.inputs.length;
		if (!this.#isInputButton) nodeCount = World.component.outputs.length;
		let index = this.isAddButton ? nodeCount - .2 : -.8;

		let deltaFromCenter = index - (nodeCount - 1) / 2;
		return new Vector(
			this.#isInputButton ? 0 : World.component.size.value[0], 
			World.component.size.value[1] / 2 + deltaFromCenter * Renderer.NodeMargin,
		);
	}

	constructor(_isInputButton, _isAddButton) {
		super();
		this.isAddButton = _isAddButton;
		this.#isInputButton = _isInputButton;
		this.hitBox = new CircularHitBox({radius: this.radius}, this);
		this.hitBox.enable();
	}

	onClick() {
		let nodes = World.component.inputs;
		let constructor = WorldInputNode
		if (!this.#isInputButton) 
		{
			nodes = World.component.outputs;
			constructor = WorldOutputNode
		}

		if (this.isAddButton) return nodes.push(new constructor({index: nodes.length, name: ''}, World.component));
		let node = nodes.pop();
		let lines = [...node.linesTo, ...node.linesFrom];
		for (let line of lines) line.remove();
	}
}



