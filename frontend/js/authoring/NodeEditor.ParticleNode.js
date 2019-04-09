let epsilon = 0.01;
function _TranslateAnchor(val) {
	if(val=='top')return new THREE.Vector3(0+epsilon, 50+epsilon, -50+epsilon);
	if(val=='center') return new THREE.Vector3(0+epsilon, 0+epsilon, -50+epsilon);
	if(val=='top left') return new THREE.Vector3(-50+epsilon, 50+epsilon, -50+epsilon);
	if(val=='top right') return new THREE.Vector3(50+epsilon, 50+epsilon, -50+epsilon);
	if(val=='right') return new THREE.Vector3(50+epsilon, 0+epsilon, -50+epsilon);
	if(val=='left') return new THREE.Vector3(-50+epsilon, 0+epsilon, -50+epsilon);
	if(val=='down right') return new THREE.Vector3(50+epsilon, -30+epsilon, -50+epsilon);
	if(val=='down left') return new THREE.Vector3(-50+epsilon, -30+epsilon, -50+epsilon);
	if(val=='down') return new THREE.Vector3(0+epsilon, -30+epsilon, -50+epsilon);
}
function _TranslateDirection(val) {
	if(val=='top right') return new THREE.Vector3(1+epsilon, 1+epsilon, 0+epsilon);
	if(val=='top') return new THREE.Vector3(0+epsilon, 1+epsilon, 0+epsilon);
	if(val=='top left') return new THREE.Vector3(-1+epsilon, 1+epsilon, 0+epsilon);
	if(val=='left') return new THREE.Vector3(-1+epsilon, 0+epsilon, 0+epsilon);
	if(val=='right') return new THREE.Vector3(1+epsilon, 0+epsilon, 0+epsilon);
	if(val=='down') return new THREE.Vector3(0+epsilon,-1+epsilon,0+epsilon);
	if(val=='down left') return new THREE.Vector3(-1+epsilon,-1+epsilon,0+epsilon);
	if(val=='down right') return new THREE.Vector3(1+epsilon,-1+epsilon,0+epsilon);
}
function _TranslateScale(name) {
	if(name=='small')return 5;
	if(name=='middle')return 10;
	if(name=='big')return 20;
}

function _TranslateVelocity(name) {
	if(name=='small')return 10;
	if(name=='middle')return 30;
	if(name=='big')return 100;
}

function _TranslateForce(name) {
	if(name=='small')return 1;
	if(name=='middle')return 5;
	if(name=='big')return 10;
}

function _TranslateRegion(name) {
	if(name=='small')return 10;
	if(name=='middle')return 50;
	if(name=='big')return 100;
}

function _GetConfiguration(anchor_name, direction_name, texture_name, scale_name, velocity_name) {
	return {
		anchor: _TranslateAnchor(anchor_name),
		direction: _TranslateDirection(direction_name),
		texture_name: texture_name,
		scale: _TranslateScale(scale_name),
		velocity: _TranslateVelocity(velocity_name)
	};
}

function _GetConfigurationDecorator(position_name, force_name, region_name) {
	return {
		position: _TranslateAnchor(position_name),
		force: _TranslateForce(force_name),
		region: _TranslateRegion(region_name)
	};
}

function AnchorNode()
{
	let that = this;
	that.properties = {anchor: 'center', direction: 'top right', texture: 'heart', texture_name: '', scale: 'middle', velocity: 'middle'};
	this.addWidget("combo","anchor", "center", function (val) {
			that.properties.anchor = val;
		},
		{values: ['center', 'top left', 'top', 'top right', 'right', 'down right',
			'down', 'down left', 'left']});

	this.addWidget("combo","direction", "top right", function (val) {
			that.properties.direction = val;
		},
		{values: ['top left', 'top', 'top right', 'right', 'down right',
				'down', 'down left', 'left']});
	this.addWidget("combo","icon", "", function (val) {
		that.properties.texture = val;
		},
		{values: ['', 'dot', 'fire', 'heart', 'poop', 'raindrop', 'snow', 'splatter1',
			'splatter2', 'surprised1', 'surprised2', 'bubble']});
	this.addWidget("text","emoji", "", function (val) {
		that.properties.texture_name = val;
	});
	this.addWidget("combo","scale", "middle", function (val) {
			that.properties.scale = val;
		},
		{values: ['small', 'middle', 'big']});
	this.addWidget("combo","velocity", "middle", function (val) {
			that.properties.velocity = val;
		},
		{values: ['small', 'middle', 'big']});
	that.addInput("trigger", LiteGraph.EVENT);
	that.addInput("attraction1", Proton.Attraction);
	that.addInput("attraction2", Proton.Attraction);
}

AnchorNode.prototype.onExecute = function()
{
	if(this.getInputData(0, false)==LiteGraph.EVENT){
		let config = _GetConfiguration(this.properties.anchor,
			this.properties.direction,
			this.properties.texture,
			this.properties.scale,
			this.properties.velocity);

		if(this.properties.texture_name!=''){
			config.texture_name = this.properties.texture_name;
		}
		let emitter = CreateEmitterWithConfiguration1(config);

		let attraction1 = this.getInputData(1,false);
		let attraction2 = this.getInputData(2,false);
		if(attraction1!=null){
			emitter.addBehaviour(attraction1);
		}
		if(attraction2!=null){
			emitter.addBehaviour(attraction2);
		}

		editor.particle_engine_proton.addEmitter(emitter);
		editor.particle_engine_proton.addRender(new Proton.SpriteRender(editor.scene));
		emitter.emit('once');

		editor.GlobalRunningEmotionCMDState.running = true;
	}
}

AnchorNode.title = "Point";
AnchorNode.color = "#2c7fb8";
AnchorNode.shape = LiteGraph.ROUND_SHAPE;

LiteGraph.registerNodeType("node_editor/anchor", AnchorNode );


function OverwhelmNode()
{
	let that = this;
	that.properties = {direction: 'down', texture: 'heart', scale: 'middle', velocity: 'middle'};
	this.addWidget("combo","direction", "down", function (val) {
			that.properties.direction = val;
		},
		{values: ['top', 'left', 'down', 'right', 'top left', 'top right', 'down left', 'down right']});
	this.addWidget("combo","texture", "heart", function (val) {
			that.properties.texture = val;
		},
		{values: ['dot', 'fire', 'heart', 'poop', 'raindrop', 'snow', 'splatter1',
				'splatter2', 'surprised1', 'surprised2', 'bubble']});
	this.addWidget("combo","scale", "middle", function (val) {
			that.properties.scale = val;
		},
		{values: ['small', 'middle', 'big']});
	this.addWidget("combo","velocity", "middle", function (val) {
			that.properties.velocity = val;
		},
		{values: ['small', 'middle', 'big']});
	that.addInput("trigger", LiteGraph.EVENT);
	that.addInput("attraction1", Proton.Attraction);
	that.addInput("attraction2", Proton.Attraction);
}

OverwhelmNode.prototype.onExecute = function()
{
	if(this.getInputData(0, false)==LiteGraph.EVENT){
		let anchor = '';
		if(this.properties.direction=='down') anchor='top';
		if(this.properties.direction=='top') anchor='down';
		if(this.properties.direction=='left') anchor='right';
		if(this.properties.direction=='right') anchor='left';
		if(this.properties.direction=='top left') anchor='down right';
		if(this.properties.direction=='top right') anchor='down left';
		if(this.properties.direction=='down left') anchor='top right';
		if(this.properties.direction=='down right') anchor='top left';

		let config = _GetConfiguration(anchor,
			this.properties.direction,
			this.properties.texture,
			this.properties.scale,
			this.properties.velocity);
		let emitter = CreateEmitterWithConfiguration2(config);

		let attraction1 = this.getInputData(1,false);
		let attraction2 = this.getInputData(2,false);
		if(attraction1!=null){
			emitter.addBehaviour(attraction1);
		}
		if(attraction2!=null){
			emitter.addBehaviour(attraction2);
		}

		editor.particle_engine_proton.addEmitter(emitter);
		editor.particle_engine_proton.addRender(new Proton.SpriteRender(editor.scene));
		emitter.emit('once');

		editor.GlobalRunningEmotionCMDState.running = true;
	}
}

OverwhelmNode.title = "Full Screen";
OverwhelmNode.color = "#2c7fb8";
OverwhelmNode.shape = LiteGraph.ROUND_SHAPE;

LiteGraph.registerNodeType("node_editor/overwhelm", OverwhelmNode );


function AttractionNode()
{
	let that = this;
	that.properties = {position: 'down', force: 'middle', region: 'middle'};
	this.addWidget("combo","position", "down", function (val) {
			that.properties.position = val;
		},
		{values: ['top', 'left', 'down', 'right', 'top left', 'top right', 'down left', 'down right']});
	this.addWidget("combo","force", "middle", function (val) {
			that.properties.texture = val;
		},
		{values: ['small', 'middle', 'big']});
	this.addWidget("combo","region", "middle", function (val) {
			that.properties.scale = val;
		},
		{values: ['small', 'middle', 'big']});

	that.addOutput("", Proton.Attraction);
}

AttractionNode.prototype.onExecute = function()
{
	let that = this;
	setTimeout(function () {
		let config = _GetConfigurationDecorator(that.properties.position,
			that.properties.force,
			that.properties.region);
		let attraction = CreateAttractionWithConfiguration(config);
		that.setOutputData(0, attraction);
	}, TIME_STEP);
}

AttractionNode.title = "Attraction";
AttractionNode.color = "#2c7fb8";
AttractionNode.shape = LiteGraph.ROUND_SHAPE;

LiteGraph.registerNodeType("node_editor/attraction", AttractionNode );







