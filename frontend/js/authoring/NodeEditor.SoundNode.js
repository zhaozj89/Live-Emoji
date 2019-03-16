function SoundNode()
{
	let that = this;
	that.properties = {sound: "", play: ""};
	this.addWidget("combo","sound", "", function (val) {
		that.properties.sound = val;
		},
		{values: ['', 'bill', 'burp', "cry", "laugh", "scream", "slurp"]});

	this.addWidget("combo","play", "", function (val) {
			that.properties.play = val;
		},
		{values: ['', 'play', 'pause']});
	that.addInput("",LiteGraph.EVENT);
}

SoundNode.prototype.onExecute = function()
{
	let that = this;
	if(that.getInputData(0, false)==LiteGraph.EVENT){
		if(that.properties.sound!='' && editor.sound_player!=null){
			let name = that.properties.sound;

			console.log(that.properties.play);
			if(that.properties.play=='play') {

				editor.sound_player.register(name);
				editor.sound_player.play(name);
			}
			if(that.properties.play=='pause'){
				editor.sound_player.pause(name);
			}
		}
	}
}

SoundNode.title = "Human Sound";
SoundNode.color = "#7fcdbb";
SoundNode.shape = LiteGraph.ROUND_SHAPE;

LiteGraph.registerNodeType("node_editor/sound", SoundNode );







function EmotionSoundNode()
{
	let that = this;
	that.properties = {name: "", play: ""};
	this.addWidget("text","name", "", function (val) {
			that.properties.text = val;
		});

	this.addWidget("combo","play", "", function (val) {
			that.properties.play = val;
		},
		{values: ['', 'play', 'pause']});
	that.addInput("",LiteGraph.EVENT);
}

EmotionSoundNode.prototype.onExecute = function()
{
	let that = this;
	if(that.getInputData(0, false)==LiteGraph.EVENT){
		if(that.properties.name!='' && editor.sound_player!=null){
			let name = 'emotion/' + that.properties.name;

			if(that.properties.play=='play') {

				editor.sound_player.register(name);
				editor.sound_player.play(name);
			}
			if(that.properties.play=='pause'){
				editor.sound_player.pause(name);
			}
		}
	}
}

EmotionSoundNode.title = "Emotion Sound";
EmotionSoundNode.color = "#7fcdbb";
EmotionSoundNode.shape = LiteGraph.ROUND_SHAPE;

LiteGraph.registerNodeType("node_editor/emotion_sound", EmotionSoundNode );