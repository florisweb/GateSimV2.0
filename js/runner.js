
const Runner = new class {
	runs = 0;
	nodes = [];
	paths = [];

	logRunStats = true;
	logRunTrace = false;


	registerPathEnd(_path) {
		this.paths.push(_path);
	}

	evaluatePaths() {
		this.paths = [];
		for (let input of World.inputs)
		{
			input.evaluatePaths();
		}
	}

	run() {
		let start = new Date();
		this.runViaPaths(this.runs === 0);
		if (this.logRunStats) console.log('Finished running 1 round:', new Date() - start + 'ms', this.runs);

		setTimeout(() => this.run(), 1000);
		this.runs++;
	}


	#curPaths = [];
	runViaPaths(_runEverything = false) {
		let updates = 0;
		let curSubTick = 0;

		for (let node of World.nodes) delete node.lastTickUpdate;
		this.#curPaths = Object.assign([], this.paths);


		while (this.#curPaths.length)
		{
																											if (this.logRunTrace) console.log('--- tick ' + curSubTick + ' ---');
			let pathsToBeRemoved = [];
			for (let path of this.#curPaths)
			{
				let node = path[curSubTick];
				if (!node) // Path is finished
				{
					pathsToBeRemoved.push(path);
					continue;
				}
				
				// The Node is already updated in this subtick: updating it won't change anything as its context has not changed [TOOD, could be changed due to loops, which make it so that not all updates are at the same depth anymore]
				if (node.lastTickUpdate === curSubTick) continue; 
				node.lastTickUpdate = curSubTick;
				updates++;
				
				let prevValue = node.value;
				let newValue = node.calcValue();
																											if (this.logRunTrace) console.log(node.name + ':', prevValue + ' -> ' + newValue, path.map(r => r.name));

				if (newValue !== prevValue || node instanceof InputNode || _runEverything) continue;
																											if (this.logRunTrace) console.log('[NO CHANGE]: Remove following paths:');
				// If the node's value does not change neither will the values of the nodes that are dependant on it: so remove all paths with this node at this position
				for (let path2 of this.#curPaths)
				{
					if (path2[curSubTick] !== node) continue;
					pathsToBeRemoved.push(path2);
																											if (this.logRunTrace) console.log(path2.map(r => r.name));
				}
			}

																											if (this.logRunTrace) console.info('[remove ' + pathsToBeRemoved.length + ' paths]', this.paths.length);
			for (let path of pathsToBeRemoved) this.#removePath(path);
			curSubTick++;
		}
																											if (this.logRunStats) console.warn('Done running...', curSubTick + ' subticks', '(' + updates + ' node updates)');
	}

	#removePath(_path) {
		this.#curPaths.splice(this.#curPaths.findIndex((p) => p === _path), 1);
	}
}










