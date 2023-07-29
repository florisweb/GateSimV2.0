# GateSimV2.0



## Serializer
As every component simply exists of lines connecting its in- and outputs to other components' (including Nand-gates) in- and outputs, all we need to store is which component's in-/output is connected to which other component's in-/output.

### Components
The componentId identifies the component as a block that can be used, whereas the internalId identifies a specific instance of that blocktype.

[1]: Definition

	{
		name
		componentId,
		inputs: [{name}],
		outputs: [{name}]
		content: [..., lines and components]
	}
[2]: Usage
	{
		componentId		
		internalId
		position
	}



### NandGates
The nandgate is the only predefined, hardcoded component, and is defined similarly to the non-standard components.

	{
		name: 'Nand'
		componentId: -1
	}



### Lines
A line is simply a connection between two nodes of 1 or 2 components.

	{
		type: 'line'
		fromNodeId
		toNodeId
	}