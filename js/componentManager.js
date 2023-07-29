
class _ComponentManager {
	components = [];

	getById(_compId) {
		return this.components.find((c) => c.componentId === _compId);
	}



	deserializeComponent(_serialized) {
		let deserializedContent = [];

		let lines = [];
		for (let item of _serialized.content)
		{
			switch (item.type)
			{
				case 'Nand':
					let nandGate = new NandGate(item);
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
		


		// attach the lines

		// Fix parent-references

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
			console.log(fromNode, toNode);
			let line = new Line(fromNode, toNode);
			self.content.push(line);
		}

		return self;
	}
}

