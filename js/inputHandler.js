document.onmousedown = function() { 
  InputHandler.mouseDown = true;
}
document.onmouseup = function() {
  InputHandler.mouseDown = false;
}



class _InputHandler {
	#HTML = {}

	mouseDown = false;
	dragging = false;

	settings = {
		dragSpeed: 1,
		scrollSpeed: .005
	}



	constructor({canvas}) {
		this.#HTML.canvas = canvas;
		this.#assignOnScrollHandler();
		this.#assignMouseMoveHandler();
		this.#assignMouseDragHandler();
	}



	#assignOnScrollHandler() {
		this.#HTML.canvas.addEventListener('wheel', event => {
			let canvPos = new Vector(
				event.offsetX / this.#HTML.canvas.offsetWidth * this.#HTML.canvas.width, 
				event.offsetY / this.#HTML.canvas.offsetHeight * this.#HTML.canvas.height
			);
			let startWorldPosition = Renderer.camera.canvPosToWorldPos(canvPos);
			Renderer.camera.zoom = Renderer.camera.zoom + event.deltaY * this.settings.scrollSpeed;

			let endWorldPosition = Renderer.camera.canvPosToWorldPos(canvPos);
			Renderer.camera.position.add(endWorldPosition.difference(startWorldPosition));

			return false; 
		}, false);
	}



	#assignMouseMoveHandler() {
		this.#HTML.canvas.addEventListener("mousemove", _e => {
		  	let worldPosition = this.#eventToWorldPos(_e);
	    	Builder.handleMouseMove(worldPosition);
		});
	}



	#assignMouseDragHandler() {
		let dragStartTime = new Date();
		const minDragTimeToStart = 100;

		window.addEventListener("mousedown", _e => {
			dragStartTime = new Date();
			let worldPosition = this.#eventToWorldPos(_e);
		});

		this.#HTML.canvas.addEventListener("mouseup", _e => {
			if (this.dragging) return stopDragging();

			let worldPosition = this.#eventToWorldPos(_e);
			Builder.clickHandler(worldPosition, _e);
		});


		let prevDragVector = false;
		this.#HTML.canvas.addEventListener("mousemove", _e => {
			if (new Date() - dragStartTime < minDragTimeToStart && !this.dragging) return;
			if (!this.mouseDown) return stopDragging();
			this.dragging = true;

			if (prevDragVector)
			{
				let deltaPos = new Vector(_e.screenX, _e.screenY).difference(prevDragVector);
				let moveVector = deltaPos.scale(this.settings.dragSpeed * Renderer.camera.zoom);
				let worldPosition = this.#eventToWorldPos(_e);
				
				dragHandler(worldPosition, moveVector);
			}

			prevDragVector = new Vector(_e.screenX, _e.screenY);
		});

		function stopDragging() {
			InputHandler.dragging = false;
			prevDragVector = false;
		}


		function dragHandler(_position, _delta) {
			Renderer.camera.position.add(_delta);
		}
	}


	#eventToWorldPos(_e) {
		let mousePosition = new Vector(
			_e.offsetX / this.#HTML.canvas.offsetWidth * this.#HTML.canvas.width, 
			_e.offsetY / this.#HTML.canvas.offsetHeight * this.#HTML.canvas.height
		);
  	return Renderer.camera.canvPosToWorldPos(mousePosition);
	}
}



















class _KeyHandler {
	keys = [];
	shortCuts = [
		{
			keys: ["Escape"], 
			event: function () {
				Builder.cancelBuildLines();
			},
			ignoreIfInInputField: false
		},
		{
			keys: ["Backspace"], 
			event: async function () {
				if (!Builder.selectedItems.length) return;
				for (let item of Builder.selectedItems)
				{
					if (item.isNode) continue;
					item.remove();
				}
				Builder.cancelBuildLines();
				Builder.onComponentChanged();
			},
			ignoreIfInInputField: true
		},
	];



	constructor() {
		window.addEventListener("keydown", _e => {
			this.keys[_e.key] = true;
			this.handleKeys(_e);
		});

		window.addEventListener("keyup", _e => {
			this.keys[_e.key] = false;
		});
	}

  handleKeys(_event) {
		let inInputField = _event.target.type == "text" || _event.target.type == "textarea" ? true : false;

		for (let i = 0; i < this.shortCuts.length; i++)
		{
			let curShortcut = this.shortCuts[i]; 
			if (curShortcut.ignoreIfInInputField && inInputField) continue;

			let success = true;
			for (let i = 0; i < curShortcut.keys.length; i++)
			{
				let curKey = curShortcut.keys[i];
				if (this.keys[curKey]) continue;
				success = false;
				break;
			}

			if (!success) continue;

			_event.target.blur();

			let status = false;
			try {status = curShortcut.event(_event);}
			catch (e) {console.warn(e)};
			return true;
		}
	}
}








