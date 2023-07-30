
let Renderer;
let InputHandler;
let KeyHandler;
let ComponentManager;
let HitBoxManager;
let Builder;





const World = new class {
	size = new Vector(950, 950);

	nodes = [];



	component;

	async setup() {
		ComponentManager = new _ComponentManager();
		HitBoxManager = new _HitBoxManager();
		Builder = new _Builder();
		Renderer = new _Renderer();
		InputHandler = new _InputHandler({canvas: Renderer.canvas});
		KeyHandler = new _KeyHandler();
		Renderer.setup();



		// const nandGate = new NandGate();
		// this.component = new WorldComponent({
		// 	inputs: [{name: 'input 1'}],
		// 	outputs: [{name: 'output 1'}],
		// 	content: [
		// 		nandGate,
		// 	]
		// });

		// let line1 = new Line(this.component.inputs[0], nandGate.inputs[0]);
		// this.component.content.push(line1);
		// let line2 = new Line(nandGate.outputs[0], this.component.outputs[0]);
		// this.component.content.push(line2);
		// let line3 = new Line(nandGate.outputs[0], nandGate.inputs[1]);
		// this.component.content.push(line3);



		// s = World.component.serialize();
		// a = ComponentManager.deserializeComponent(s);
		// b = ComponentManager.deserializeComponent(s);
		// a.relativePosition.value = [100, 100];
		// b.relativePosition.value = [100, 300];
		// World.component.content.push(a);
		// World.component.content.push(b);
		// World.component.content.push(new Line(World.component.inputs[0], a.inputs[0]))
		// World.component.content.push(new Line(a.outputs[0], b.inputs[0]))



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








		const nandGateA = new NandGate();
		nandGateA.relativePosition.value[0] = 300;
		nandGateA.relativePosition.value[1] = 200;

		const nandGateB = new NandGate();
		nandGateB.relativePosition.value[0] = 500;
		nandGateB.relativePosition.value[1] = 200;

		const nandGateC = new NandGate();
		nandGateC.relativePosition.value[0] = 500;
		nandGateC.relativePosition.value[1] = 600;

		const invA = new NandGate();
		invA.relativePosition.value[0] = 700;
		invA.relativePosition.value[1] = 200;

		const invB = new NandGate();
		invB.relativePosition.value[0] = 700;
		invB.relativePosition.value[1] = 600;

		this.component = new WorldComponent({
			inputs: [{name: 'input 1'}, {name: 'input 2'}, {name: 'input 3'}, {name: 'input 4'}, {name: 'input 5'}],
			outputs: [{name: 'output 1'}, {name: 'output 2'}, {name: 'output 3'}, {name: 'output 4'}, {name: 'input 5'}],
			content: [
				nandGateA,
				nandGateB,
				nandGateC,
				invA,
				invB,
			]
		});

		this.component.content.push(new Line(this.component.inputs[0], nandGateA.inputs[0]));
		this.component.content.push(new Line(this.component.inputs[0], nandGateB.inputs[0]));
		this.component.content.push(new Line(this.component.inputs[0], nandGateC.inputs[0]));

		this.component.content.push(new Line(this.component.inputs[1], nandGateA.inputs[1]));
		this.component.content.push(new Line(this.component.inputs[1], nandGateB.inputs[0]));
		this.component.content.push(new Line(this.component.inputs[1], nandGateC.inputs[1]));


		this.component.content.push(new Line(nandGateA.outputs[0], nandGateB.inputs[1]));
		this.component.content.push(new Line(nandGateB.outputs[0], invA.inputs[0]));
		this.component.content.push(new Line(nandGateB.outputs[0], invA.inputs[1]));


		this.component.content.push(new Line(nandGateC.outputs[0], invB.inputs[0]));
		this.component.content.push(new Line(nandGateC.outputs[0], invB.inputs[1]));

		this.component.content.push(new Line(invA.outputs[0], this.component.outputs[0]));
		this.component.content.push(new Line(invB.outputs[0], this.component.outputs[1]));




		// s = JSON.parse("{\"type\":\"WorldComponent\",\"relativePosition\":[0,0],\"inputs\":[{\"name\":\"input 1\"},{\"name\":\"input 2\"}],\"outputs\":[{\"name\":\"output 1\"},{\"name\":\"output 2\"}],\"content\":[{\"type\":\"Nand\",\"relativePosition\":[300,200],\"inputs\":[{\"name\":\"NandOUT A\"},{\"name\":\"NandOUT B\"}],\"outputs\":[{\"name\":\"NandIN\"}]},{\"type\":\"Nand\",\"relativePosition\":[500,200],\"inputs\":[{\"name\":\"NandOUT A\"},{\"name\":\"NandOUT B\"}],\"outputs\":[{\"name\":\"NandIN\"}]},{\"type\":\"Nand\",\"relativePosition\":[500,600],\"inputs\":[{\"name\":\"NandOUT A\"},{\"name\":\"NandOUT B\"}],\"outputs\":[{\"name\":\"NandIN\"}]},{\"type\":\"Nand\",\"relativePosition\":[700,200],\"inputs\":[{\"name\":\"NandOUT A\"},{\"name\":\"NandOUT B\"}],\"outputs\":[{\"name\":\"NandIN\"}]},{\"type\":\"Nand\",\"relativePosition\":[700,600],\"inputs\":[{\"name\":\"NandOUT A\"},{\"name\":\"NandOUT B\"}],\"outputs\":[{\"name\":\"NandIN\"}]},{\"type\":\"Line\",\"fromId\":\"CI-1|IN0\",\"toId\":\"CI0|IN0\"},{\"type\":\"Line\",\"fromId\":\"CI-1|IN0\",\"toId\":\"CI1|IN0\"},{\"type\":\"Line\",\"fromId\":\"CI-1|IN0\",\"toId\":\"CI2|IN0\"},{\"type\":\"Line\",\"fromId\":\"CI-1|IN1\",\"toId\":\"CI0|IN1\"},{\"type\":\"Line\",\"fromId\":\"CI-1|IN1\",\"toId\":\"CI1|IN0\"},{\"type\":\"Line\",\"fromId\":\"CI-1|IN1\",\"toId\":\"CI2|IN1\"},{\"type\":\"Line\",\"fromId\":\"CI0|OUT0\",\"toId\":\"CI1|IN1\"},{\"type\":\"Line\",\"fromId\":\"CI1|OUT0\",\"toId\":\"CI3|IN0\"},{\"type\":\"Line\",\"fromId\":\"CI1|OUT0\",\"toId\":\"CI3|IN1\"},{\"type\":\"Line\",\"fromId\":\"CI2|OUT0\",\"toId\":\"CI4|IN0\"},{\"type\":\"Line\",\"fromId\":\"CI2|OUT0\",\"toId\":\"CI4|IN1\"},{\"type\":\"Line\",\"fromId\":\"CI3|OUT0\",\"toId\":\"CI-1|OUT0\"},{\"type\":\"Line\",\"fromId\":\"CI4|OUT0\",\"toId\":\"CI-1|OUT1\"}]}");
		// a = ComponentManager.deserializeComponent(s);
		// b = ComponentManager.deserializeComponent(s);
		// c = ComponentManager.deserializeComponent(s);
		// d = ComponentManager.deserializeComponent(s);
		// a.relativePosition.value = [300, 100];
		// b.relativePosition.value = [300, 300];
		// c.relativePosition.value = [300, 500];
		// d.relativePosition.value = [300, 700];


		// World.component.content = [
		// 	a, b, c, d,
		// 	new Line(World.component.inputs[0], a.inputs[0]),
		// 	new Line(World.component.inputs[1], a.inputs[1]),
		// 	new Line(World.component.inputs[2], b.inputs[0]),
		// 	new Line(World.component.inputs[3], c.inputs[0]),
		// 	new Line(World.component.inputs[4], d.inputs[0]),

		// 	new Line(a.outputs[1], b.inputs[1]),
		// 	new Line(b.outputs[1], c.inputs[1]),
		// 	new Line(c.outputs[1], d.inputs[1]),
			
		// 	new Line(a.outputs[0], World.component.outputs[0]),
		// 	new Line(b.outputs[0], World.component.outputs[1]),
		// 	new Line(c.outputs[0], World.component.outputs[2]),
		// 	new Line(d.outputs[0], World.component.outputs[3]),
		// 	new Line(d.outputs[1], World.component.outputs[4]),
		// ];
		// Runner.evaluatePaths();
		// function setInputs() {
		// 	for (let i = 0; i < World.component.inputs.length; i++)
		// 	{
		// 		World.component.inputs[i].value = !!arguments[i]
		// 	}
		// }






		await wait(1);
		Runner.evaluatePaths();
		Renderer.render();
		Runner.run();
	}
}




World.setup();