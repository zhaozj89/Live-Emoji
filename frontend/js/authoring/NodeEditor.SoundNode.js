function SoundNode()
{
	let that = this;
	that.properties = {sound: ""};
	that.text = this.addWidget("combo","sound", "", function (val) {
		that.properties.sound = val;
		},
		{values: ['', 'bill', 'burp', "cry", "laugh", "scream", "slurp"]});
	that.addInput("",LiteGraph.EVENT);
}

SoundNode.prototype.onExecute = function()
{
	let that = this;
	if(that.getInputData(0, false)==LiteGraph.EVENT){
		if(that.properties.sound!='' && editor.sound_player!=null){
			let name = that.properties.sound;
			console.log(name);
			editor.sound_player.register(name);
			editor.sound_player.play(name);
		}
	}
}

SoundNode.title = "Sound";
SoundNode.color = "#a95166";
SoundNode.shape = LiteGraph.ROUND_SHAPE;

LiteGraph.registerNodeType("node_editor/sound", SoundNode );