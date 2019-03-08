function DanmakuNode()
{
	let that = this;
	that.properties = {text: ""};
	that.text = this.addWidget("text","text", "", function (val) {
		that.properties.text = val;
		});
	that.addInput("",LiteGraph.EVENT);
}

DanmakuNode.prototype.onExecute = function()
{
	let that = this;
	if(that.getInputData(0, false)==LiteGraph.EVENT && editor.danmaku_bmtext.text!=null){
		editor.danmaku_bmtext.text = that.properties.text;
		editor.signals.sceneGraphChanged.dispatch();
	}
}

DanmakuNode.title = "Danmaku";
DanmakuNode.color = "#39a971";
DanmakuNode.shape = LiteGraph.ROUND_SHAPE;

LiteGraph.registerNodeType("node_editor/danmaku", DanmakuNode );










