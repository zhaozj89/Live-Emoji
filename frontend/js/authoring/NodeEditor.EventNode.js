// 1-9
function KeyboardNumberNode()
{
	let that = this;
	that.properties = {key:null};
	that.addWidget("combo","key", "", function(val){
		that.properties.key = val;
	}, {values:["",'0','1','2','3','4','5','6','7','8','9']} );
	that.addOutput('',LiteGraph.EVENT);
}

KeyboardNumberNode.prototype.onExecute = function()
{
	let that = this;
	if(this.properties.key!=null && editor.emotionCMDManager.current_key==this.properties.key){
		this.setOutputData(0, LiteGraph.EVENT);
		
		setTimeout( function () {
			that.setOutputData(0, null);
			editor.emotionCMDManager.current_key = null;
		}, TIME_STEP );
	}
}

KeyboardNumberNode.title = "Keyboard (0-9)";
KeyboardNumberNode.color = "#cb181d";
KeyboardNumberNode.shape = LiteGraph.ROUND_SHAPE;

LiteGraph.registerNodeType("node_editor/keyboard_number", KeyboardNumberNode );


// a-z
function KeyboardNode1()
{
	let that = this;
	that.properties = {key:null};
	that.addWidget("combo","key", "", function(val){
		that.properties.key = val;
	}, {values:['a','b','c','d','e','f','g','h','i','j','k','l','m','o','p','q','r','s','t','u','v','w','x','y','z']} );
	that.addOutput('',LiteGraph.EVENT);
}

KeyboardNode1.prototype.onExecute = function()
{
	let that = this;
	if(this.properties.key!=null && editor.emotionCMDManager.current_key==this.properties.key){
		this.setOutputData(0, LiteGraph.EVENT);
		
		setTimeout( function () {
			that.setOutputData(0, null);
			editor.emotionCMDManager.current_key = null;
		}, TIME_STEP );
	}
}

KeyboardNode1.title = "Keyboard (a-z)";
KeyboardNode1.color = "#cb181d";
KeyboardNode1.shape = LiteGraph.ROUND_SHAPE;

LiteGraph.registerNodeType("node_editor/keyboard1", KeyboardNode1 );

// A-Z
function KeyboardNode2()
{
	let that = this;
	that.properties = {key:null};
	that.addWidget("combo","key", "", function(val){
		that.properties.key = val;
	}, {values:['A','B','C','D','E','F','G','H','I','J','K','L','M','O','P','Q','R','S','T','U','V','W','X','Y','Z']} );
	that.addOutput('',LiteGraph.EVENT);
}

KeyboardNode2.prototype.onExecute = function()
{
	let that = this;
	if(this.properties.key!=null && editor.emotionCMDManager.current_key==this.properties.key){
		this.setOutputData(0, LiteGraph.EVENT);
		setTimeout( function () {
			that.setOutputData(0, null);
			editor.emotionCMDManager.current_key = null;
		}, TIME_STEP );
	}
}

KeyboardNode2.title = "Keyboard (A-Z)";
KeyboardNode2.color = "#cb181d";
KeyboardNode2.shape = LiteGraph.ROUND_SHAPE;

LiteGraph.registerNodeType("node_editor/keyboard2", KeyboardNode2 );


// A-Z
function FaceEmotionTriggerNode()
{
	let that = this;
	that.properties = {emotion: ''};
	that.addWidget("combo","emotion", "", function(val){
		that.properties.emotion = val;
	}, {values:['','angry','disgusted','fearful','happy','sad','surprised']} );
	that.addOutput('',LiteGraph.EVENT);
}

FaceEmotionTriggerNode.prototype.onExecute = function()
{

	let that = this;
	console.log('event');
	console.log(editor.current_emotion);
	if(editor.current_emotion!=null && editor.current_emotion==that.properties.emotion){
		// console.log('emotion in');
		this.setOutputData(0, LiteGraph.EVENT);
		// setTimeout( function () {
		// 	that.setOutputData(0, null);
		// 	editor.current_emotion = null;
		// }, TIME_STEP );
	}
	if(editor.current_emotion!=null && editor.current_emotion!=that.properties.emotion){
		this.setOutputData(0, '');
	}
}

FaceEmotionTriggerNode.title = "Facial Expression";
FaceEmotionTriggerNode.color = "#cb181d";
FaceEmotionTriggerNode.shape = LiteGraph.ROUND_SHAPE;

LiteGraph.registerNodeType("node_editor/emotion_trigger", FaceEmotionTriggerNode );

function MouseNode()
{
	let that = this;
	that.properties = {side:null};
	that.addWidget("combo","side", "", function(val){
		that.properties.side = val;
	}, {values:['','left','right']} );
	that.addOutput('',LiteGraph.EVENT);
}

MouseNode.prototype.onExecute = function()
{
	let that = this;
	if(this.properties.side!=null && editor.emotionCMDManager.current_mouse==this.properties.side){
		this.setOutputData(0, LiteGraph.EVENT);
		setTimeout( function () {
			that.setOutputData(0, null);
			editor.emotionCMDManager.current_mouse = null;
		}, TIME_STEP );
	}
}

MouseNode.title = "Mouse";
MouseNode.color = "#cb181d";
MouseNode.shape = LiteGraph.ROUND_SHAPE;

LiteGraph.registerNodeType("node_editor/mouse", MouseNode );


function CounterNode()
{
	let that = this;
	that.properties = {num:0, counter: 0, first_time: true};
	that.addWidget("combo","num", 0, function(val){
		that.properties.num = val;
		that.properties.counter = val;
	}, {values:[0, 1, 5, 10, 20, 50]} );
	that.addInput('', LiteGraph.EVENT);
	that.addOutput('',LiteGraph.EVENT);
}
CounterNode.prototype.onExecute = function()
{
	let that = this;
	if(that.getInputData(0, false)==LiteGraph.EVENT){
		for(let k=0; k<that.properties.num; ++k){
			setTimeout(function () {
				console.log('even');
				that.setOutputData(0, LiteGraph.EVENT);
				that.properties.counter -=1;
				if(that.properties.counter==0){
					that.properties.num=0;
					that.widgets[0].value = 0;
				}
			}, 2000*k);
			setTimeout(function () {
				console.log('odd');
				that.setOutputData(0, '');
			}, 2000*k+TIME_STEP);
		}
	}
}
CounterNode.title = "Counter";
CounterNode.color = "#cb181d";
CounterNode.shape = LiteGraph.ROUND_SHAPE;

CounterNode.prototype.onDrawBackground = function(ctx)
{
	if(this.flags.collapsed)
		return;
	this.outputs[0].label = this.properties.counter;
}

LiteGraph.registerNodeType("node_editor/counter", CounterNode );










