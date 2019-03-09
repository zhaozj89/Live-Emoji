function FountainNode()
{
	let that = this;
	that.properties = {shape: 'sphere', color: 'red', size: 10};
	that.text = this.addWidget("combo","shape", "sphere", function (val) {
		that.properties.shape = val;
		}, {values: ['sphere', 'box']});

	that.text = this.addWidget("combo","color", "red", function (val) {
		that.properties.color = val;
	}, {values: ['red', 'green', 'blue', 'yellow', 'pink']});

	that.text = this.addWidget("combo","size", 10, function (val) {
		that.properties.size = val;
	}, {values: [10, 20, 30, 50]});

	that.addInput("", LiteGraph.EVENT);
}

FountainNode.prototype.onExecute = function()
{
	let that = this;
	if(this.getInputData(0, false)==LiteGraph.EVENT){
		let emitter = CreateEmitterWithMesh({p:{x: 0,y: 0, z: 10},
			Body: CreateMesh(that.properties.shape, that.properties.color, that.properties.size)});

		editor.particle_engine_proton.addEmitter(emitter);
		editor.particle_engine_proton.addRender(new Proton.MeshRender(editor.scene));
		emitter.emit('once');
		editor.GlobalRunningEmotionCMDState.has_particle_node = true;
		editor.UpdateRunningEmotionCMDState();
	}
}

FountainNode.title = "3D";
FountainNode.color = "#ae0cff";
FountainNode.shape = LiteGraph.ROUND_SHAPE;

LiteGraph.registerNodeType("node_editor/fountain", FountainNode );


function IllusionNode()
{
	let that = this;
	that.properties = {texture: 'dot'};
	that.text = this.addWidget("combo","texture", "dot", function (val) {
		that.properties.texture = val;
		},
		{values: ['dot', 'fire', 'heart', 'poop', 'raindrop', 'snow', 'splatter1',
			'splatter2', 'surprised1', 'surprised2', 'bubble']});
	that.addInput("", LiteGraph.EVENT);
}

IllusionNode.prototype.onExecute = function()
{
	if(this.getInputData(0, false)==LiteGraph.EVENT){
		let emitter = CreateEmitterWithTexture1(this.properties.texture);
		editor.particle_engine_proton.addEmitter(emitter);
		editor.particle_engine_proton.addRender(new Proton.SpriteRender(editor.scene));
		emitter.emit('once');
		editor.GlobalRunningEmotionCMDState.has_particle_node = true;
		editor.UpdateRunningEmotionCMDState();
	}
}

IllusionNode.title = "Ramble";
IllusionNode.color = "#ae0cff";
IllusionNode.shape = LiteGraph.ROUND_SHAPE;

LiteGraph.registerNodeType("node_editor/illusion", IllusionNode );




function FireNode()
{
	let that = this;
	that.properties = {};
	that.properties = {texture: 'dot'};
	that.text = this.addWidget("combo","texture", "dot", function (val) {
			that.properties.texture = val;
		},
		{values: ['dot', 'fire', 'heart', 'poop', 'raindrop', 'snow', 'splatter1',
				'splatter2', 'surprised1', 'surprised2', 'bubble']});
	that.addInput("", LiteGraph.EVENT);
}

FireNode.prototype.onExecute = function()
{
	if(this.getInputData(0, false)==LiteGraph.EVENT){
		let emitter = CreateEmitterWithTexture2(this.properties.texture);
		editor.particle_engine_proton.addEmitter(emitter);
		editor.particle_engine_proton.addRender(new Proton.SpriteRender(editor.scene));
		emitter.emit('once');
		editor.GlobalRunningEmotionCMDState.has_particle_node = true;
		editor.UpdateRunningEmotionCMDState();
	}
}

FireNode.title = "Fire";
FireNode.color = "#ae0cff";
FireNode.shape = LiteGraph.ROUND_SHAPE;

LiteGraph.registerNodeType("node_editor/fire", FireNode );





function SnowNode()
{
	let that = this;
	that.properties = {};
	that.properties = {texture: 'dot'};
	that.text = this.addWidget("combo","texture", "dot", function (val) {
			that.properties.texture = val;
		},
		{values: ['dot', 'fire', 'heart', 'poop', 'raindrop', 'snow', 'splatter1',
				'splatter2', 'surprised1', 'surprised2', 'bubble']});
	that.addInput("", LiteGraph.EVENT);
}

SnowNode.prototype.onExecute = function()
{
	if(this.getInputData(0, false)==LiteGraph.EVENT){
		let emitter = CreateEmitterSnow(this.properties.texture);
		editor.particle_engine_proton.addEmitter(emitter);
		editor.particle_engine_proton.addRender(new Proton.SpriteRender(editor.scene));
		emitter.emit('once');
		editor.GlobalRunningEmotionCMDState.has_particle_node = true;
		editor.UpdateRunningEmotionCMDState();
	}
}

SnowNode.title = "Snow";
SnowNode.color = "#ae0cff";
SnowNode.shape = LiteGraph.ROUND_SHAPE;

LiteGraph.registerNodeType("node_editor/snow", SnowNode );







