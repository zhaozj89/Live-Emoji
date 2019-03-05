function _NameTranslate(name) {
	if(name==="Beijing") return "beijing.jpg";
	if(name==="Hong Kong") return "hk.jpg";
	if(name==="France") return "france.jpg";
}

function BackgroundNode()
{
	let that = this;
	that.properties = {place: "Hong Kong"};
	that.text = this.addWidget("combo","place", "Hong Kong", function (val) {
		that.properties.place = val;
		},
		{values: ['Beijing', 'Hong Kong', 'France']});
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





