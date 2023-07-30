


class _Builder {
	selectedItems = [];


	clickHandler(_worldPos) {
		console.log('click', _worldPos);
		this.selectedItems = [];
		let result = HitBoxManager.getItemByPosition(_worldPos);
		if (result) this.selectedItems = [result.parent];

	}
  
}