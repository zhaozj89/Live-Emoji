function _NameTranslate(name) {
	if(name=="Beijing") return "beijing.jpg";
	if(name=="Hong Kong") return "hk.jpg";
	if(name=="France") return "france.jpg";
	if(name=="Museum") return "museum.jpg";
	if(name=="Sky") return "sky.jpg";
}

function BackgroundNode()
{
	let that = this;
	that.properties = {place: "Hong Kong"};
	that.text = this.addWidget("combo","place", "Hong Kong", function (val) {
		that.properties.place = val;
		},
		{values: ['Beijing', 'Hong Kong', 'France', "Museum", "Sky"]});
	that.addInput("",LiteGraph.EVENT);
}

BackgroundNode.prototype.onExecute = function()
{
	if(this.getInputData(0, false)==LiteGraph.EVENT){
		if(editor.staic_background_material.name!=this.properties.place){
			editor.staic_background_material.name = this.properties.place;
			editor.staic_background_material.material.map =
				new THREE.TextureLoader().load('asset/panorama/' + _NameTranslate(this.properties.place));
			editor.staic_background_material.material.needsUpdate = true;
		}
	}
}

BackgroundNode.title = "Background";
BackgroundNode.color = "#ff13a3";
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
	}
}

BackgroundRotationNode.title = "Background Rotation";
BackgroundRotationNode.color = "#ff13a3";
BackgroundRotationNode.shape = LiteGraph.ROUND_SHAPE;

LiteGraph.registerNodeType("node_editor/background_rotation", BackgroundRotationNode );








