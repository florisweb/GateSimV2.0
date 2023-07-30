async function wait(_ms) {
	return new Promise((resolve) => setTimeout(resolve, _ms));
}

function newId() {
	return String(Math.random() * 10000000000000000).split('.')[0];
}

function $() {
	return document.querySelectorAll(...arguments);
}

function createElement(_tag = 'div', _class = '') {
	let el = document.createElement(_tag);
	el.className = _class;
	return el;
}

function setTextToElement(element, text) {
  element.innerHTML = "";
  let a = document.createElement('a');
  a.text = text;
  element.append(a);
}
