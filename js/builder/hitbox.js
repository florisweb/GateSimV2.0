


class _HitBoxManager {
  list = [];

  register(_hitBoxItem) {
    // if (!_hitBoxItem.getDepth) return console.warn("[!] HitBoxManager: Found an item that doesn't have a getDepth()-function", _hitBoxItem);
    // if (_hitBoxItem.getDepth() > Renderer.maxRenderDepth) return;
    this.list.push(_hitBoxItem);
  }

  clear() {
    this.list = [];
  }
  unregister(_id) {
    for (let i = this.list.length - 1; i >= 0; i--)
    {
      if (this.list[i].id != _id) continue;
			this.list.splice(i, 1);
      return true;
    }
    return false;
  }


  getItemByPosition(_position, _config = {mustBeClickable: false, mustBeDraggable: false}) {
    let minArea = Infinity;
    let clickedItem = false;
    for (let item of this.list)
    {
      // if (item.getDepth() > Renderer.maxRenderDepth) continue;
      if (_config.mustBeClickable && !item.clickable) continue;
      if (_config.mustBeDraggable && !item.draggable) continue;
      if (!item.isPointInside(_position)) continue;

      if (item.area > minArea) continue;
      minArea = item.area;
      clickedItem = item;
    }

    return clickedItem;
  }
}






class BaseHitbox {
	id = newId();
	parent;
	offset = new Vector(0, 0);
	enabled = false;

	get position() {
		return this.parent.position.copy().add(this.offset);
	}

	isPointInside() {}

	constructor({offset}, _parent) {
		this.parent = _parent;
		if (offset) this.offset = offset;
	}

	enable() {
		HitBoxManager.register(this);
		this.enabled = true;
	}
	remove() {
		HitBoxManager.unregister(this.id);
		this.enabled = false;
	}
}

class RectangularHitBox extends BaseHitbox {
	diagonal = new Vector(0, 0);

	constructor({offset, diagonal}, _parent) {
		super({offset: offset}, _parent);
		this.diagonal = diagonal;
	}

	isPointInside(_pos) {
		let delta = this.position.difference(_pos);
		if (delta.value[0] < 0 || delta.value[1] < 0) return false;
		if (delta.value[0] > this.diagonal.value[0] || delta.value[1] > this.diagonal.value[1]) return false;
		return true;
	}
}

class CircularHitBox extends BaseHitbox {
	radiusSquared = 0;

	constructor({offset, radius}, _parent) {
		super({offset: offset}, _parent);
		this.radiusSquared = radius*radius;
	}

	isPointInside(_pos) {
		return this.position.difference(_pos).getSquaredLength() < this.radiusSquared;
	}
}




