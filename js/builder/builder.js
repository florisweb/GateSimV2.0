


class _Builder {
	selectedItems = [];
	buildLines = [];


	curMousePos = new Vector(0, 0);


	clickHandler(_worldPos) {
		console.log('click', _worldPos);
		this.selectedItems = [];
		let result = HitBoxManager.getItemByPosition(_worldPos);
		if (result) this.selectedItems = [result.parent];


		this.handleLineBuildClicks(result.parent);
		
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

		console.log('start build line', _node);
	}



	handleMouseMove(_mousePos) {
		this.curMousePos = _mousePos;
	}








	onComponentChanged() {
		Runner.evaluatePaths();
	}


  
}

