function _TranslaceScale(scale) {
	if(scale=='small') return 0.05;
	if(scale=='middle') return 0.1;
	if(scale=='big') return 0.2;
}

function DanmakuNode()
{
	let that = this;
	that.properties = {text: "", scale: 'middle'};
	this.addWidget("combo","scale", "middle", function (val) {
		that.properties.scale = val;
		}, {values: ['small', 'middle', 'big']});

	this.addWidget("text","text", "", function (val) {
		that.properties.text = val;
	});
	that.addInput("",LiteGraph.EVENT);
}

DanmakuNode.prototype.onExecute = function()
{
	let that = this;
	if(that.getInputData(0, false)==LiteGraph.EVENT && editor.danmaku_bmtext.text!=null){
		editor.danmaku_bmtext.text = that.properties.text;
		editor.danmaku_bmtext.position.set( 30, 20, -50 );
		editor.danmaku_bmtext.position.applyQuaternion(editor.main_camera.quaternion);
		let scale_val = _TranslaceScale(that.properties.scale);
		editor.danmaku_bmtext.scale.set(scale_val,scale_val,scale_val);
		editor.signals.sceneGraphChanged.dispatch();

		// setTimeout(function () {
		// 	editor.danmaku_bmtext.text = '';
		// 	editor.signals.sceneGraphChanged.dispatch();
		// }, 2000);
	}
}

DanmakuNode.title = "Text";
DanmakuNode.color = "#41b6c4";
DanmakuNode.shape = LiteGraph.ROUND_SHAPE;

LiteGraph.registerNodeType("node_editor/danmaku", DanmakuNode );










