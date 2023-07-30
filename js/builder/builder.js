


class _Builder {
	selectedItems = [];
	buildLines = [];


	curMousePos = new Vector(0, 0);


	clickHandler(_worldPos) {
		this.selectedItems = [];
		let hitBox = HitBoxManager.getItemByPosition(_worldPos);
		let item = hitBox.parent;
		if (!item) return;
		if (!item.isNode) this.selectedItems = [item];
		this.handleLineBuildClicks(item);
	}


	handleMouseMove(_mousePos) {
		this.curMousePos = _mousePos;
	}




	handleLineBuildClicks(_node) {
		if (!_node.isNode) return;

		// Finish lines
		if (this.buildLines.length) 
		{
			if (_node instanceof WorldInputNode) return;
			if (!_node.isInput && !(_node instanceof WorldOutputNode)) return;

			for (let i = 0; i < this.buildLines.length; i++)
			{
				let line = new Line(this.buildLines[i].fromNode, _node);
				World.component.content.push(line);
			}
			this.onComponentChanged();
			this.buildLines = [];
			return;
		} 

		// Start creating lines
		if (_node instanceof WorldOutputNode) return;
		if (_node.isInput && !(_node instanceof WorldInputNode)) return;

		let line = new BuildLine(_node);
		this.buildLines.push(line);
		this.selectedItems.push(_node)
	}

	cancelBuildLines() {
		this.buildLines = [];
	}











	onComponentChanged() {
		Runner.evaluatePaths();
	}
}

