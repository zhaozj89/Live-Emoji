var system;

function setup() {
	let res = createCanvas(720, 400);

	var container = new UI.Panel();
	container.setId( 'p5Canvas' );
	container.setPosition( 'absolute' );
	container.setTop( '32px' );
	container.setRight( '600px' );
	container.setBottom( '32px' );
	container.setLeft( '0px' );
	container.setOpacity( 0.2 );
	container.dom.style.zIndex = "1";

	// let canvas = new UI.Canvas();
	// canvas.setId( 'mainCanvas' );
	// canvas.setPosition( 'absolute' );
	// canvas.dom.style.width = '100%';
	// canvas.dom.style.height = '100%';
	//
	// container.add( canvas );


	// let div = document.getElementById( 'my' );
	document.body.appendChild( container.dom );
	container.dom.appendChild( res.canvas );

	system = new ParticleSystem(createVector(width/2, 50));
}

function draw() {
	background(51);
	system.addParticle();
	system.run();
}

// A simple Particle class
var MyParticle = function(position) {
	this.acceleration = createVector(0, 0.05);
	this.velocity = createVector(random(-1, 1), random(-1, 0));
	this.position = position.copy();
	this.lifespan = 255.0;
};

MyParticle.prototype.run = function() {
	this.update();
	this.display();
};

// Method to update position
MyParticle.prototype.update = function(){
	this.velocity.add(this.acceleration);
	this.position.add(this.velocity);
	this.lifespan -= 2;
};

// Method to display
MyParticle.prototype.display = function() {
	stroke(200, this.lifespan);
	strokeWeight(2);
	fill(127, this.lifespan);
	ellipse(this.position.x, this.position.y, 12, 12);
};

// Is the particle still useful?
MyParticle.prototype.isDead = function(){
	if (this.lifespan < 0) {
		return true;
	} else {
		return false;
	}
};

var ParticleSystem = function(position) {
	this.origin = position.copy();
	this.particles = [];
};

ParticleSystem.prototype.addParticle = function() {
	this.particles.push(new MyParticle(this.origin));
};

ParticleSystem.prototype.run = function() {
	for (var i = this.particles.length-1; i >= 0; i--) {
		var p = this.particles[i];
		p.run();
		if (p.isDead()) {
			this.particles.splice(i, 1);
		}
	}
};
