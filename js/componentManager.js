
class _ComponentManager {

	#components = [];
	get components() {
		return this.#components
	}


	constructor() {
		try {
			this.#components = JSON.parse(localStorage.components);
		} catch (_e) {
			console.warn('[ComponentManager]: Error while loading components:', _e);
			return;
		}
		console.warn('[ComponentManager]: Succesfully loaded ' + this.#components.length + ' components.');
	}


	getById(_compId) {
		return this.#components.find((c) => c.componentId === _compId);
	}
	clear() {
		this.#components = [];
		localStorage.components = JSON.stringify(this.#components);
		ComponentPanel.update();
	}



	addComponent(_comp) {
		this.#components.push(_comp);
		localStorage.components = JSON.stringify(this.#components);
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
					if (item.isReference)
					{
						let template = this.getById(item.componentId);
						if (!template) {
							console.warn('[deserialize] Could not find component-reference:', item);
							continue;
						} 
						deserializedContent.push(this.deserializeComponent(template));
					} else deserializedContent.push(this.deserializeComponent(item));
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

