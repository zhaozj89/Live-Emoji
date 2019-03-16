function _NameTranslate(name, scene) {
	return name+'/scene'+scene+'.jpg';
}

function BackgroundNode()
{
	let that = this;
	that.properties = {place: "Antarctica", scene: "1"};
	this.addWidget("combo","place", "Antarctica", function (val) {
		that.properties.place = val;
		},
		{values: ['Antarctica', 'Earth', 'Everest', "Itza", "Jiuzhaigou", "Petra", "Solar", "World"]});

	this.addWidget("combo","scene", "1", function (val) {
			that.properties.scene = val;
		},
		{values: ['1', '2', '3', "4", "5", "6"]});
	that.addInput("",LiteGraph.EVENT);
}

BackgroundNode.prototype.onExecute = function()
{
	let name = _NameTranslate(this.properties.place, this.properties.scene);
	if(this.getInputData(0, false)==LiteGraph.EVENT){
		if(editor.staic_background_material.name!=name){
			editor.staic_background_material.name = name;
			editor.staic_background_material.material.map =
				new THREE.TextureLoader().load('asset/panorama/' + name);
			editor.staic_background_material.material.needsUpdate = true;
		}
	}
}

BackgroundNode.title = "Background";
BackgroundNode.color = "#88419d";
BackgroundNode.shape = LiteGraph.ROUND_SHAPE;

LiteGraph.registerNodeType("node_editor/background", BackgroundNode );




function BackgroundRotationNode()
{
	let that = this;
	that.properties = {rotation_x: 0, rotation_y: 0, rotation_z: 0};
	that.text = this.addWidget("combo","rotation x", "0", function (val) {
			that.properties.rotation_x = val;
		},
		{values: ['0', '45', '90', '180']});
	that.text = this.addWidget("combo","rotation y", "0", function (val) {
			that.properties.rotation_y = val;
		},
		{values: ['0', '45', '90', '180']});
	that.text = this.addWidget("combo","rotation z", "0", function (val) {
			that.properties.rotation_z = val;
		},
		{values: ['0', '45', '90', '180']});
	that.addInput("",LiteGraph.EVENT);
}

BackgroundRotationNode.prototype.onExecute = function()
{
	let that = this;
	if(this.getInputData(0, false)==LiteGraph.EVENT){
		editor.static_background_sphere.rotation.x += (Math.PI * Number(that.properties.rotation_x)/180);
		editor.static_background_sphere.rotation.y += (Math.PI * Number(that.properties.rotation_y)/180);
		editor.static_background_sphere.rotation.z += (Math.PI * Number(that.properties.rotation_z)/180);

		editor.static_background_sphere.rotation.x %= (2*Math.PI);
		editor.static_background_sphere.rotation.y %= (2*Math.PI);
		editor.static_background_sphere.rotation.z %= (2*Math.PI);

		editor.signals.main_camera_rotate_y.dispatch(Math.PI * Number(that.properties.rotation_y)/180);
	}
}

BackgroundRotationNode.title = "Background Rotation";
BackgroundRotationNode.color = "#88419d";
BackgroundRotationNode.shape = LiteGraph.ROUND_SHAPE;

LiteGraph.registerNodeType("node_editor/background_rotation", BackgroundRotationNode );









