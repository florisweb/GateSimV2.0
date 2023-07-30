
class _Header {
	#HTML = {
		nameHolder: $('#header .componentNameHolder')[0],
	}

	get curComponentName() {
		return this.#HTML.nameHolder.value;
	}
	set curComponentName(_newName) {
		this.#HTML.nameHolder.value = _newName;
	}

	packageComponent() {
		let comp = Builder.packageComponent();
		ComponentManager.addComponent(comp);
	}
}