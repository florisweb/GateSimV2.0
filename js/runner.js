
const Runner = new class {
	runs = 0;

	nodes = [];
	nodesPerDepth = [];
	paths = [];


	registerNodeAtDepth(_node, _depth) {
		if (typeof this.nodesPerDepth[_depth] !== 'object') this.nodesPerDepth[_depth] = [];
		if (this.nodesPerDepth[_depth].includes(_node)) return;
		this.nodesPerDepth[_depth].push(_node);
	}

	registerPathEnd(_path) {
		this.paths.push(_path);
	}

	evaluatePaths() {
		this.nodesPerDepth = [];
		this.paths = [];
		for (let input of World.inputs)
		{
			input.evaluatePaths();
		}
	}

	run() {
		let start = new Date();
		this.runViaPaths(this.runs === 0);
		console.log('Finished running 1 round:', new Date() - start + 'ms', this.runs);

		// setTimeout(() => this.run(), 1000);
		this.runs++;
	}



	runViaLayers() {
		for (let layer of this.nodesPerDepth)
		{
			for (let node of layer) node.calcValue();
		}
	}



	#curPaths = [];
	runViaPaths(_runEverything = false) {
		let updates = 0;
		let curSubTick = 0;

		for (let node of World.nodes) delete node.lastTickUpdate;
		this.#curPaths = Object.assign([], this.paths);

		while (this.#curPaths.length)
		{
			console.log('--- tick ' + curSubTick + ' ---');
			let pathsToBeRemoved = [];
			for (let path of this.#curPaths)
			{
				let node = path[curSubTick];
				if (!node) // Path is finished
				{
					pathsToBeRemoved.push(path);
					continue;
				}
				
				if (node.lastTickUpdate === curSubTick) continue;
				node.lastTickUpdate = curSubTick;
				
				// console.log('update', node.name);
				let prevValue = node.value;
				let newValue = node.calcValue();
				console.log(node.name + ':', prevValue + ' -> ' + newValue, path.map(r => r.name));
				updates++;

				if (newValue !== prevValue || node instanceof InputNode || _runEverything) continue;
				console.log('[NO CHANGE]: Remove following paths:');
				
				// Actually all paths with this specific node at this position can be removed				
				for (let path2 of this.#curPaths)
				{
					if (path2[curSubTick] !== node) continue;
					pathsToBeRemoved.push(path2);
					console.log(path2.map(r => r.name));
				}
			}

			console.info('[remove ' + pathsToBeRemoved.length + ' paths]', this.paths.length);
			for (let path of pathsToBeRemoved) this.#removePath(path);
			curSubTick++;
		}
		console.warn('Done running...', curSubTick + ' subticks', '(' + updates + ' node updates)');
	}

	#removePath(_path) {
		this.#curPaths.splice(this.#curPaths.findIndex((p) => p === _path), 1);
	}






	// requiresUpdate = new RequiresUpdateArr();

	// curTick = 0;
	// run(_inputValue) {	
	// 	startNode.value = _inputValue;
	// 	this.requiresUpdate.push(startNode);
	// 	this.requiresUpdate.sort((A, B) => A.prevSubTick > B.prevSubTick);
	// 	console.log(this.requiresUpdate);
	


	// 	this.curTick++;
	// 	let goingToUpdate = Object.assign([], this.requiresUpdate);
	// 	this.requiresUpdate = [];
	// 	console.log(goingToUpdate, this.requiresUpdate);

	// 	for (let node of goingToUpdate)
	// 	{
	// 		node.update(this.curTick);
	// 	}

	// 	this.print();
	// }


	printState() {
		console.table([
				['IN', 'NAND IN', 'NAND OUT', 'OUT'],
				[startNode.value, nandGate.inputs[0].value, nandGate.outputs[0].value, finishNode.value],
				['', nandGate.inputs[1].value, '', '']
			]
		);
	}

	printDepth() {
		// console.table([
		// 		['IN', 'NAND IN', 'NAND OUT', 'OUT'],
		// 		[startNode.depths.join(','), nandGate.inputs[0].depths.join(','), nandGate.outputs[0].depths.join(','), finishNode.depths.join(',')],
		// 		['', nandGate.inputs[1].depths.join(','), '', '']
		// 	]
		// );



		console.table([
				['IN', 'NAND A IN', 'NAND B OUT', 'OUT'],
				[startNode.depths.join(','), 
					nandGate.inputs[0].depths.join(','), 
					nandGate.outputs[0].depths.join(','), 
					finishNode.depths.join(',')],
				['', nandGate.inputs[1].depths.join(','), '', '']
			]
		);
	}
}










