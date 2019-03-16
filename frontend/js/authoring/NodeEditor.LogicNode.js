function AndNode()
{
	let that = this;
	that.addInput('', LiteGraph.EVENT);
	that.addInput('', LiteGraph.EVENT);
	that.addOutput('',LiteGraph.EVENT);
}

AndNode.prototype.onExecute = function()
{
	if(this.getInputData(0, false)==LiteGraph.EVENT && this.getInputData(1, false)==LiteGraph.EVENT){
		console.log('works');
		this.setOutputData(0, LiteGraph.EVENT);
	}
	else{
		this.setOutputData(0, "");
	}
}

AndNode.title = "AND";
AndNode.color = "#238745";
AndNode.shape = LiteGraph.ROUND_SHAPE;

LiteGraph.registerNodeType("node_editor/and", AndNode );

function OrNode()
{
	let that = this;
	that.addInput('', LiteGraph.EVENT);
	that.addInput('', LiteGraph.EVENT);
	that.addOutput('',LiteGraph.EVENT);
}

OrNode.prototype.onExecute = function()
{
	if(this.getInputData(0, false)==LiteGraph.EVENT || this.getInputData(1, false)==LiteGraph.EVENT){
		this.setOutputData(0, LiteGraph.EVENT);
	}
	else{
		this.setOutputData(0, "");
	}
}

OrNode.title = "OR";
OrNode.color = "#238745";
OrNode.shape = LiteGraph.ROUND_SHAPE;

LiteGraph.registerNodeType("node_editor/or", OrNode );











