async function wait(_ms) {
	return new Promise((resolve) => setTimeout(resolve, _ms));
}

function newId() {
	return String(Math.random() * 10000000000000000).split('.')[0];
}