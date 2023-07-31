

class _Camera {
	viewsize = new Vector(800, 600);
	position = new Vector(0, 0);
	
	#zoom = 1;	
	#minZoom = .1;
	#maxZoom = Infinity;

	get zoom() {
		return this.#zoom;
	}

	set zoom(_zoom) {
		this.#zoom = Math.min(Math.max(_zoom, this.#minZoom), this.#maxZoom);
	}

	setup() {
		this.position = World.component.size.copy(0).scale(.5);
	}
	

	getWorldProjectionSize() {
		return this.viewsize.copy().scale(this.zoom);
	}

	worldPosToCanvPos(_position) {
		let topLeftPosition = this.position.copy().add(this.getWorldProjectionSize().scale(-.5));
		let rPos = topLeftPosition.difference(_position);
		return rPos.scale(1 / this.zoom);
	}
	canvPosToWorldPos(_position) {		
		let rPos = _position.copy().scale(this.zoom).add(this.getWorldProjectionSize().scale(-.5));
		return this.position.copy().add(rPos); 
	}


	onResize() {
		this.viewsize = new Vector(
    		Renderer.canvas.width,
    		Renderer.canvas.height
  		);
	}
}

