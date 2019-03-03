function TriggerNode()
{
	let that = this;
	that.properties = {semantics:null, valence:null, arousal:null, key:null};
	that.addWidget("text","semantics", "", function(val){
		that.properties.semantics = val;
	}, {} );
	that.addWidget("text","valence", "", function(val){
		that.properties.valence = val;
	}, {} );
	that.addWidget("text","arousal", "", function(val){
		that.properties.arousal = val;
	}, {} );
	that.addWidget("text","key", "", function(val){
		that.properties.key = val;
	}, {} );
	that.addOutput('',"number");
}

TriggerNode.prototype.setEditor = function(val){
	this.editor = val;
}

TriggerNode.prototype.onExecute = function()
{
	let that = this;
	if(that.editor.emotionCMDManager.current_key==that.properties.key){
		that.setOutputData(0, 1);
	}
	else{
		that.setOutputData(0, 0);
	}
}

TriggerNode.title = "Trigger Node";
TriggerNode.color = "#800080";
TriggerNode.shape = LiteGraph.ROUND_SHAPE;

LiteGraph.registerNodeType("node_editor/trigger", TriggerNode );





