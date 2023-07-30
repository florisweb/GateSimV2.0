
class _ComponentManager {

	#components = [];
	get components() {
		return this.#components
	}



	getById(_compId) {
		return this.#components.find((c) => c.componentId === _compId);
	}



	addComponent(_comp) {
		this.#components.push(_comp);
		ComponentPanel.update();
	}

	createComponentFromId(_id) {
		let compTemplate = this.#components.find((_comp) => _comp.componentId === _id);
		if (!compTemplate) return;
		return this.deserializeComponent(compTemplate);
	}



	deserializeComponent(_serialized) {
		let deserializedContent = [];

		let lines = [];
		for (let item of _serialized.content)
		{
			switch (item.type)
			{
				case 'Nand':
					let nandGate = new NandGate({
						...item,
						relativePosition: new Vector(...item.relativePosition)
					});
					deserializedContent.push(nandGate);
					break;
				case 'CustomComponent':
					deserializedContent.push(this.deserializeComponent(item));
					break;
				case 'Line':
					lines.push(item);
					break;
			}
		}

		let self = new Component({
			..._serialized,
			relativePosition: new Vector(..._serialized.relativePosition),
			content: deserializedContent,
		});
		
		for (let comp of self.content) comp.setParent(self);

		for (let lineData of lines)
		{
			let fromNode = self.getNodeById(lineData.fromId);
			let toNode = self.getNodeById(lineData.toId);
			let line = new Line(fromNode, toNode);
			self.content.push(line);
		}

		return self;
	}
}

