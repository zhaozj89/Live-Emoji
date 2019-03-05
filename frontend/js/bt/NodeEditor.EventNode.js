function KeyboardNode()
{
	let that = this;
	that.properties = {key:null};
	that.addWidget("combo","key", "", function(val){
		that.properties.key = val;
	}, {values:["","a","b","c"]} );
	that.addOutput('',"trigger");
}

KeyboardNode.prototype.onExecute = function()
{
	let that = this;
	if(this.properties.key!=null && editor.emotionCMDManager.current_key==this.properties.key){
		this.setOutputData(0, LiteGraph.EVENT);
		setTimeout( function () {
			that.setOutputData(0, null);
			editor.emotionCMDManager.current_key = null;
		}, 20 );
	}
}

KeyboardNode.title = "Keyboard";
KeyboardNode.color = "#ff0300";
KeyboardNode.shape = LiteGraph.ROUND_SHAPE;

LiteGraph.registerNodeType("node_editor/keyboard", KeyboardNode );





