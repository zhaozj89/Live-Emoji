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
		editor.selected.updateEmotion( that.properties.emotion );
		editor.GlobalRunningEmotionCMDState.running = true;
		editor.signals.sceneGraphChanged.dispatch();
	}
}

FaceEmotionNode.title = "Face Emotion";
FaceEmotionNode.color = "#253494";
FaceEmotionNode.shape = LiteGraph.ROUND_SHAPE;

LiteGraph.registerNodeType("node_editor/face_emotion", FaceEmotionNode );


// function FaceRotationNode()
// {
// 	let that = this;
// 	that.properties = {rotation_x: 0, rotation_y: 0, rotation_z: 0};
// 	that.text = this.addWidget("combo","rotation x", "0", function (val) {
// 			that.properties.rotation_x = val;
// 		},
// 		{values: ['0', '45', '90', '180']});
// 	that.text = this.addWidget("combo","rotation y", "0", function (val) {
// 			that.properties.rotation_y = val;
// 		},
// 		{values: ['0', '45', '90', '180']});
// 	that.text = this.addWidget("combo","rotation z", "0", function (val) {
// 			that.properties.rotation_z = val;
// 		},
// 		{values: ['0', '45', '90', '180']});
// 	that.addInput("",LiteGraph.EVENT);
// }
//
// FaceRotationNode.prototype.onExecute = function()
// {
// 	let that = this;
// 	if(this.getInputData(0, false)==LiteGraph.EVENT){
// 		if(editor.selected!=null){
// 			console.log(editor.selected.rotation);
// 			editor.selected.rotation.x += (Math.PI * Number(that.properties.rotation_x)/180);
// 			editor.selected.rotation.y += (Math.PI * Number(that.properties.rotation_y)/180);
// 			editor.selected.rotation.z += (Math.PI * Number(that.properties.rotation_z)/180);
//
// 			editor.selected.rotation.x %= (2*Math.PI);
// 			editor.selected.rotation.y %= (2*Math.PI);
// 			editor.selected.rotation.z %= (2*Math.PI);
// 			console.log(editor.selected.rotation);
// 		}
// 	}
// }
//
// FaceRotationNode.title = "Face Rotation";
// FaceRotationNode.color = "#253494";
// FaceRotationNode.shape = LiteGraph.ROUND_SHAPE;
//
// LiteGraph.registerNodeType("node_editor/face_rotation", FaceRotationNode );
//

function FacePositionNode()
{
	let that = this;
	that.properties = {position_x: 0, position_y: 0, position_z: 0};
	that.text = this.addWidget("combo","position x", "0", function (val) {
			that.properties.position_x = val;
		},
		{values: ['-2', '-1', '0', '1', '2']});
	that.text = this.addWidget("combo","position y", "0", function (val) {
			that.properties.position_y = val;
		},
		{values: ['-2', '-1', '0', '1', '2']});
	that.text = this.addWidget("combo","position z", "0", function (val) {
			that.properties.position_z = val;
		},
		{values: ['-2', '-1', '0', '1', '2']});
	that.addInput("",LiteGraph.EVENT);
}

FacePositionNode.prototype.onExecute = function()
{
	let that = this;
	if(this.getInputData(0, false)==LiteGraph.EVENT){
		if(editor.selected!=null){
			editor.selected.position.x += Number(that.properties.position_x);
			editor.selected.position.y += Number(that.properties.position_y);
			editor.selected.position.z += Number(that.properties.position_z);
		}
	}
}

FacePositionNode.title = "Face Position";
FacePositionNode.color = "#253494";
FacePositionNode.shape = LiteGraph.ROUND_SHAPE;

LiteGraph.registerNodeType("node_editor/face_position", FacePositionNode );


function FaceRoleNode()
{
	let that = this;
	that.properties = {role: ''};
	that.text = this.addWidget("combo","role", '', function (val) {
			that.properties.role = val;
		},
		{values: ['', 'girl', 'boy']});
	that.addInput("",LiteGraph.EVENT);
}

FaceRoleNode.prototype.onExecute = function()
{
	let that = this;
	if(that.getInputData(0, false)==LiteGraph.EVENT){
		if(that.properties.role=='boy') editor.boyLabel.dom.click();
		if(that.properties.role=='girl') editor.girlLabel.dom.click();
	}
}

FaceRoleNode.title = "Role";
FaceRoleNode.color = "#253494";
FaceRoleNode.shape = LiteGraph.ROUND_SHAPE;

LiteGraph.registerNodeType("node_editor/face_role", FaceRoleNode );


function FaceResetNode()
{
	this.addInput("",LiteGraph.EVENT);
}

FaceResetNode.prototype.onExecute = function()
{
	let that = this;
	if(that.getInputData(0, false)==LiteGraph.EVENT){
		editor.selected.position.x = 0;
		editor.selected.position.y = 0;
		editor.selected.position.z = -10;
		editor.signals.sceneGraphChanged.dispatch();
	}
}

FaceResetNode.title = "Reset";
FaceResetNode.color = "#253494";
FaceResetNode.shape = LiteGraph.ROUND_SHAPE;

LiteGraph.registerNodeType("node_editor/face_reset", FaceResetNode );









