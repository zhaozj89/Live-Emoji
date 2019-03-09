// a-z
function KeyboardNode1()
{
	let that = this;
	that.properties = {key:null};
	that.addWidget("combo","key", "", function(val){
		that.properties.key = val;
	}, {values:["","a","b","c",'d','e','f','g','h','i','j','k','l','m','o','p','q','r','s','t','u','v','w','x','y','z']} );
	that.addOutput('',LiteGraph.EVENT);
}

KeyboardNode1.prototype.onExecute = function()
{
	// console.log('in node:');
	// console.log(this.properties.key);
	// console.log('+++++++++++++++++');
	let that = this;
	if(this.properties.key!=null && editor.emotionCMDManager.current_key==this.properties.key){
		this.setOutputData(0, LiteGraph.EVENT);
		console.log(editor.emotionCMDManager.current_key);
		setTimeout( function () {
			that.setOutputData(0, null);
			editor.emotionCMDManager.current_key = null;
		}, TIME_STEP );
	}
}

KeyboardNode1.title = "a-z";
KeyboardNode1.color = "#ff0300";
KeyboardNode1.shape = LiteGraph.ROUND_SHAPE;

LiteGraph.registerNodeType("node_editor/keyboard1", KeyboardNode1 );

// A-Z
function KeyboardNode2()
{
	let that = this;
	that.properties = {key:null};
	that.addWidget("combo","key", "", function(val){
		that.properties.key = val;
	}, {values:["","A","B","C",'D','E','F','G','H','I','J','K','L','M','O','P','Q','R','S','T','U','V','W','X','Y','Z']} );
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

KeyboardNode2.title = "A-Z";
KeyboardNode2.color = "#ff0300";
KeyboardNode2.shape = LiteGraph.ROUND_SHAPE;

LiteGraph.registerNodeType("node_editor/keyboard2", KeyboardNode2 );


// A-Z
function FaceEmotionTriggerNode()
{
	let that = this;
	that.properties = {emotion: ''};
	that.addWidget("combo","emotion", "", function(val){
		that.properties.emotion = val;
	}, {values:["",'angry','disgusted','fearful','happy','sad','surprised']} );
	that.addOutput('',LiteGraph.EVENT);
}

FaceEmotionTriggerNode.prototype.onExecute = function()
{

	let that = this;
	console.log(that.properties.emotion);
	if(editor.current_emotion!=null && editor.current_emotion==that.properties.emotion){
		this.setOutputData(0, LiteGraph.EVENT);
		setTimeout( function () {
			that.setOutputData(0, null);
			editor.current_emotion = null;
		}, TIME_STEP );
	}
}

FaceEmotionTriggerNode.title = "Emotion";
FaceEmotionTriggerNode.color = "#ff0300";
FaceEmotionTriggerNode.shape = LiteGraph.ROUND_SHAPE;

LiteGraph.registerNodeType("node_editor/emotion_trigger", FaceEmotionTriggerNode );

// function CounterNode()
// {
// 	let that = this;
// 	that.properties = {number:0};
// 	that.addWidget("combo","number", 0, function(val){
// 		that.properties.number = val;
// 	}, {values:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} );
// 	that.addInput('',LiteGraph.EVENT);
// 	that.addOutput('',LiteGraph.EVENT);
// }
//
// CounterNode.prototype.onExecute = function()
// {
// 	let that = this;
// 	if(that.getInputData(0, false)===LiteGraph.EVENT){
// 		for(let k=0; k<that.properties.number; ++k) {
// 			this.setOutputData(0, LiteGraph.EVENT);
// 			setTimeout( function () {
// 				that.setOutputData(0, LiteGraph.EVENT);
// 			}, 20 );
// 		}
// 	}
// }
//
// CounterNode.title = "Keyboard";
// CounterNode.color = "#ff0300";
// CounterNode.shape = LiteGraph.ROUND_SHAPE;
//
// LiteGraph.registerNodeType("node_editor/counter", CounterNode );


function MouseNode()
{
	let that = this;
	that.properties = {side:null};
	that.addWidget("combo","side", "", function(val){
		that.properties.side = val;
	}, {values:["",'left','right']} );
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

MouseNode.title = "A-Z";
MouseNode.color = "#ff0300";
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
CounterNode.color = "#ff0300";
CounterNode.shape = LiteGraph.ROUND_SHAPE;

CounterNode.prototype.onDrawBackground = function(ctx)
{
	if(this.flags.collapsed)
		return;
	this.outputs[0].label = this.properties.counter;
}

LiteGraph.registerNodeType("node_editor/counter", CounterNode );










