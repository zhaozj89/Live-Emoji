function FountainNode()
{
	let that = this;
	that.properties = {};
	// that.text = this.addWidget("combo","emotion", "neutral", function (val) {
	// 	that.properties.emotion = val;
	// 	},
	// 	{values: ['happy', 'sad', 'surprised', 'disgusted', 'angry', 'fearful', 'neutral']});
	that.addInput("", LiteGraph.EVENT);
}

FountainNode.prototype.onExecute = function()
{
	if(this.getInputData(0, false)==LiteGraph.EVENT){
		let emitter = CreateEmitter({p:{x: 0,y: 0}, Body: CreateMesh("sphere")});
		editor.particle_engine_proton.addEmitter(emitter);
		emitter.emit('once');
		editor.GlobalRunningEmotionCMDState.has_particle_node = true;
		editor.UpdateRunningEmotionCMDState();
	}
}

FountainNode.title = "Fountain";
FountainNode.color = "#ae0cff";
FountainNode.shape = LiteGraph.ROUND_SHAPE;

LiteGraph.registerNodeType("node_editor/fountain", FountainNode );





