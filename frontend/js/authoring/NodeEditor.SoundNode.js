function SoundNode()
{
	let that = this;
	that.properties = {sound: "", play: ""};
	this.addWidget("combo","sound", "", function (val) {
		that.properties.sound = val;
		},
		{values: ['', 'bill', 'burp', "cry", "laugh", "scream", "slurp"]});

	that.addInput("",LiteGraph.EVENT);
	that.is_playing = false;
}

SoundNode.prototype.onExecute = function()
{
	let that = this;
	if(that.getInputData(0, false)==LiteGraph.EVENT){
		if(that.properties.sound!='' && editor.sound_player!=null){
			let name = that.properties.sound;

			if(that.is_playing==false) {
				editor.sound_player.register(name);
				editor.sound_player.play(name);
				that.is_playing=true;
			}else{
				editor.sound_player.pause(name);
				that.is_playing=false;
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
			that.properties.name = val;
		});

	that.addInput("",LiteGraph.EVENT);
	that.is_playing = false;
}

EmotionSoundNode.prototype.onExecute = function()
{
	let that = this;
	if(that.getInputData(0, false)==LiteGraph.EVENT){
		if(that.properties.name!='' && editor.sound_player!=null){
			let name = 'emotion/' + that.properties.name;

			if(that.is_playing==false) {
				editor.sound_player.register(name);
				editor.sound_player.play(name);
				that.is_playing=true;
			}else{
				editor.sound_player.pause(name);
				that.is_playing=false;
			}
		}
	}
}

EmotionSoundNode.title = "Customized Sound";
EmotionSoundNode.color = "#7fcdbb";
EmotionSoundNode.shape = LiteGraph.ROUND_SHAPE;

LiteGraph.registerNodeType("node_editor/emotion_sound", EmotionSoundNode );