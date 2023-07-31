


class _Builder {
	selectedItems = [];
	buildLines = [];


	curMousePos = new Vector(0, 0);

	dragging = false;


	clickHandler(_worldPos) {
		let selectedSomething = this.selectItemAt(_worldPos);
		let hitBox = HitBoxManager.getItemByPosition(_worldPos);
		let item = hitBox.parent;
		if (item)
		{
			if (item.type === 'button') return item.onClick();

			let isBuilding = this.handleLineBuildClicks(item);
			if (isBuilding) return;
			if (selectedSomething) return;
		}
	}

	selectItemAt(_worldPos) {
		let hitBox = HitBoxManager.getItemByPosition(_worldPos);
		let item = hitBox.parent;
		if (!item || item.isNode || item.type === 'button') return this.selectedItems = [];;

		if (!KeyHandler.shiftPressed) this.selectedItems = [];
		if (this.selectedItems.findIndex((_item) => _item.id === item.id) === -1) this.selectedItems.push(item);
		return true;
	}


	handleMouseMove(_mousePos) {
		this.curMousePos = _mousePos;
	}



	// LINE CREATE SYSTEM
	handleLineBuildClicks(_node) {
		if (!_node.isNode) return false;

		// Finish lines
		if (this.buildLines.length) 
		{
			if (_node instanceof WorldInputNode) return false;
			if (!_node.isInput && !(_node instanceof WorldOutputNode)) return false;

			for (let i = 0; i < this.buildLines.length; i++)
			{
				let lineExists = false;
				for (let item of World.component.content)
				{
					if (!(item instanceof Line)) continue;
					if (item.fromNode.id !== this.buildLines[i].fromNode.id) continue;
					if (item.toNode.id !== _node.id) continue;

					lineExists = true;
					item.remove();
				}

				if (lineExists) continue;
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

	deSelectAll() {
		this.selectedItems = [];
	}



	// DRAG SYSTEM
	onDragStart(_worldPos) {
		if (!this.selectedItems.length) this.selectItemAt(_worldPos);
		if (!this.selectedItems.length) return;
		this.dragging = true;
	}


	onDrag(_position, _delta) {
		for (let item of this.selectedItems) item.relativePosition.add(_delta.copy().scale(-1));
	}

	onDragEnd() {
		this.dragging = false;
	}








	onComponentChanged() {
		Runner.evaluatePaths();
		Runner.runViaPaths(true);
	}










	packageComponent() {
		let comp = World.component.serialize();
		comp.name = Header.curComponentName;
		comp.componentId = newId();
		return comp;
	}
}

