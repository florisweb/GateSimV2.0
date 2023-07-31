
class _ComponentPanel {
	#HTML = {
		panel: $('#componentHolder.panel')[0],
		itemHolder: $('#componentHolder .itemHolder')[0],
	}
	setup() {
		this.update();
	}

	update() {
		this.#HTML.itemHolder.innerHTML = '';
		this.#HTML.itemHolder.append(this.#renderComponent(new NandGate()));

		for (let comp of ComponentManager.components)
		{
			this.#HTML.itemHolder.append(this.#renderComponent(comp));
		}
	}

	#renderComponent(_comp) {
		let element = createElement('div', 'listItem');
		element.innerHTML = `
			<div class='nameHolder'></div>
			<div class='buttonHolder'>
				<div class='button removeButton'>X</div>
			</div>
		`;
		const nameHolder = element.children[0];
		const buttonHolder = element.children[1];


		setTextToElement(nameHolder, _comp.name + ' (' + _comp.inputs.length + ' / ' + _comp.outputs.length + ')');
		element.addEventListener('click', () => {
			let newComp;
			if (_comp instanceof NandGate)
			{
				newComp = new NandGate();
			} else newComp = ComponentManager.createComponentFromId(_comp.componentId);
			if (!newComp) return;

			newComp.relativePosition = Renderer.camera.position.copy();
			World.component.addComponent(newComp);
		});

		buttonHolder.children[0].addEventListener('click', () => {
			console.log(_comp.componentId, 'remove');
			ComponentManager.removeComponent(_comp.componentId);
		});
		return element;
	}
}