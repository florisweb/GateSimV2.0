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
