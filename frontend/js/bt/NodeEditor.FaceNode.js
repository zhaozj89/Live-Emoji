function FaceNode()
{
	let that = this;
	that.properties = {emotion: null};
	that.text = this.addWidget("combo","emotion", "neutral", function (val) {
		that.properties.emotion = val;
		},
		{values: ['happy', 'sad', 'surprised', 'disgusted', 'angry', 'fearful', 'neutral']});
	that.addInput("","number");
}

FaceNode.prototype.setEditor = function(val){
	this.editor = val;
}

FaceNode.prototype.onExecute = function()
{
	let that = this;
	if(that.getInputData(0, false)==1 && that.properties.emotion!=null&&that.editor.selected!=null){
		that.editor.selected.updateEmotion( this.properties.emotion );
		that.editor.signals.sceneGraphChanged.dispatch();
	}
}

FaceNode.title = "Face Node";
FaceNode.color = "#800080";
FaceNode.shape = LiteGraph.ROUND_SHAPE;

LiteGraph.registerNodeType("node_editor/face", FaceNode );





