function FaceEmotionNode()
{
	let that = this;
	that.properties = {emotion: null};
	that.text = this.addWidget("combo","emotion", "neutral", function (val) {
		that.properties.emotion = val;
		},
		{values: ['happy', 'sad', 'surprised', 'disgusted', 'angry', 'fearful', 'neutral']});
	that.addInput("",LiteGraph.EVENT);
}

FaceEmotionNode.prototype.onExecute = function()
{
	let that = this;
	if(that.getInputData(0, false)==LiteGraph.EVENT && that.properties.emotion!=null&&editor.selected!=null){
		that.editor.selected.updateEmotion( this.properties.emotion );
		that.editor.signals.sceneGraphChanged.dispatch();
	}
}

FaceEmotionNode.title = "Face Emotion";
FaceEmotionNode.color = "#ffb032";
FaceEmotionNode.shape = LiteGraph.ROUND_SHAPE;

LiteGraph.registerNodeType("node_editor/face_emotion", FaceEmotionNode );





