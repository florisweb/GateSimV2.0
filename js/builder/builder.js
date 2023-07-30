


class _Builder {
	selectedItems = [];
	buildLines = [];


	curMousePos = new Vector(0, 0);


	clickHandler(_worldPos) {
		this.selectedItems = [];
		let hitBox = HitBoxManager.getItemByPosition(_worldPos);
		let item = hitBox.parent;
		if (item)
		{
			let isBuilding = this.handleLineBuildClicks(item);
			if (isBuilding) return;
			if (!item.isNode) return this.selectedItems = [item];
		}

		let gate = new NandGate({relativePosition: this.curMousePos.copy()});
		World.component.addComponent(gate);
	}


	handleMouseMove(_mousePos) {
		this.curMousePos = _mousePos;
	}




	handleLineBuildClicks(_node) {
		if (!_node.isNode) return false;

		// Finish lines
		if (this.buildLines.length) 
		{
			if (_node instanceof WorldInputNode) return false;
			if (!_node.isInput && !(_node instanceof WorldOutputNode)) return false;

			for (let i = 0; i < this.buildLines.length; i++)
			{
				let line = new Line(this.buildLines[i].fromNode, _node);
				World.component.content.push(line);
			}
			this.onComponentChanged();
			this.buildLines = [];
			return true;
		} 

		// Start creating lines
		if (_node instanceof WorldOutputNode) return false;
		if (_node.isInput && !(_node instanceof WorldInputNode)) return false;

		let line = new BuildLine(_node);
		this.buildLines.push(line);
		this.selectedItems.push(_node);
		return true;
	}

	cancelBuildLines() {
		this.buildLines = [];
	}











	onComponentChanged() {
		Runner.evaluatePaths();
		Runner.runViaPaths(true);
	}
}

