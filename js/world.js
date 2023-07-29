
let Renderer;
let InputHandler;


class WorldComponent extends Component {
	type = 'WorldComponent';
	get size() {
		return World.size;
	}
}





const World = new class {
	size = new Vector(950, 950);

	nodes = [];
	lines = [];



	component = new WorldComponent();

	async setup() {
		Renderer = new _Renderer();
		InputHandler = new _InputHandler({canvas: Renderer.canvas});
		Renderer.setup();



		const nandGate = new NandGate();
		this.component = new WorldComponent({
			inputs: [{name: 'input 1'}],
			outputs: [{name: 'output 1'}],
			content: [
				nandGate,
				// new Line(startNode, nandGate.inputs[0]),
				// new Line(nandGate.outputs[0], nandGate.inputs[1]),
				// new Line(nandGate.outputs[0], finishNode)
			]
		});




		// const startNode = new WorldInputNode({index: 0}, this);
		// this.inputs.push(startNode);
		// startNode.name = 'Start';
		// const finishNode = new WorldOutputNode({index: 0}, this);
		// this.outputs.push(startNode);
		// finishNode.name = 'Finish';
		






		// const startNode = new InputNode();
		// this.inputs.push(startNode);
		// startNode.name = 'Start';
		// const finishNode = new OutputNode();
		// this.outputs.push(startNode);
		// finishNode.name = 'Finish';
		
		// const nandGate = new NandGate();
		// this.components.push(nandGate);

		// new Line(startNode, nandGate.inputs[0]);
		// new Line(startNode, nandGate.inputs[1]);
		// new Line(nandGate.outputs[0], finishNode);












		// const startNode = new InputNode();
		// this.inputs.push(startNode);
		// startNode.name = 'Start';
		// const finishNode = new OutputNode();
		// this.outputs.push(startNode);
		// finishNode.name = 'Finish';
		
		// const nandGateA = new NandGate();
		// nandGateA.position.value[0] = 300;
		// this.components.push(nandGateA);

		// const nandGateB = new NandGate();
		// nandGateB.position.value[0] = 600;
		// this.components.push(nandGateB);

		// new Line(startNode, nandGateA.inputs[0]);
		// new Line(startNode, nandGateA.inputs[1]);

		// new Line(nandGateA.outputs[0], nandGateB.inputs[0]);
		// new Line(nandGateA.outputs[0], nandGateB.inputs[1]);

		// new Line(nandGateB.outputs[0], finishNode);











		// const startNodeA = new InputNode();
		// this.inputs.push(startNodeA);
		// startNodeA.name = 'Start A';
		
		// const startNodeB = new InputNode();
		// this.inputs.push(startNodeB);
		// startNodeB.name = 'Start B';



		// const finishNode = new OutputNode();
		// this.outputs.push(finishNode);
		// finishNode.name = 'Finish';
		
		// const nandGateA = new NandGate();
		// nandGateA.position.value[1] = 200;
		// this.components.push(nandGateA);

		// const nandGateB = new NandGate();
		// nandGateB.position.value[2] = 600;
		// this.components.push(nandGateB);

		

		// new Line(startNodeA, nandGateA.inputs[0]);
		// new Line(startNodeA, nandGateA.inputs[1]);
		
		// new Line(startNodeB, nandGateB.inputs[0]);
		// new Line(startNodeB, nandGateB.inputs[1]);

		// new Line(nandGateA.outputs[0], nandGateB.inputs[0]);
		// new Line(nandGateA.outputs[0], nandGateB.inputs[1]);
		// new Line(nandGateB.outputs[0], nandGateA.inputs[0]);
		// new Line(nandGateB.outputs[0], nandGateA.inputs[1]);

		// new Line(nandGateB.outputs[0], finishNode);














		// const startNodeA = new InputNode();
		// this.inputs.push(startNodeA);
		// startNodeA.name = 'Start A';
		
		// const startNodeB = new InputNode();
		// this.inputs.push(startNodeB);
		// startNodeB.name = 'Start B';



		// const finishNodeA = new OutputNode();
		// this.outputs.push(finishNodeA);
		// finishNodeA.name = 'Finish A';


		// const finishNodeB = new OutputNode();
		// this.outputs.push(finishNodeB);
		// finishNodeB.name = 'Finish B';




		
		// const nandGateA = new NandGate();
		// nandGateA.position.value[0] = 300;
		// nandGateA.position.value[1] = 200;
		// this.components.push(nandGateA);

		// const nandGateB = new NandGate();
		// nandGateB.position.value[0] = 500;
		// nandGateB.position.value[1] = 200;
		// this.components.push(nandGateB);

		// const nandGateC = new NandGate();
		// nandGateC.position.value[0] = 500;
		// nandGateC.position.value[1] = 600;
		// this.components.push(nandGateC);

		// const invA = new NandGate();
		// invA.position.value[0] = 700;
		// invA.position.value[1] = 200;
		// this.components.push(invA);

		// const invB = new NandGate();
		// invB.position.value[0] = 700;
		// invB.position.value[1] = 600;
		// this.components.push(invB);

		

		// new Line(startNodeA, nandGateA.inputs[0]);
		// new Line(startNodeA, nandGateB.inputs[0]);
		// new Line(startNodeA, nandGateC.inputs[0]);
		
		// new Line(startNodeB, nandGateA.inputs[1]);
		// new Line(startNodeB, nandGateB.inputs[0]);
		// new Line(startNodeB, nandGateC.inputs[1]);


		// new Line(nandGateA.outputs[0], nandGateB.inputs[1]);
		// new Line(nandGateB.outputs[0], invA.inputs[0]);
		// new Line(nandGateB.outputs[0], invA.inputs[1]);


		// new Line(nandGateC.outputs[0], invB.inputs[0]);
		// new Line(nandGateC.outputs[0], invB.inputs[1]);

		// new Line(invA.outputs[0], finishNodeA);
		// new Line(invB.outputs[0], finishNodeB);






		await wait(1);
		Runner.evaluatePaths();
		Renderer.render();
		Runner.run();
	}
}




World.setup();