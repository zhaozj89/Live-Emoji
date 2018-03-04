
var P5Layer = function ( p ) {

	// console.log(editor);

	let signals = editor.signals;

	signals.runBackgroundTexturePattern.add( function ( msg ) {
		console.log( msg.sourceStrokes );
		console.log( msg.travelStrokes );
		console.log( msg.textureName );


		// continue here
	} );

	// texture for the particle
	var particle_texture = null;

	// variable holding our particle system
	var ps = null;

	p.preload = function () {
		particle_texture = p.loadImage("./asset/background/images/fire_small.png");
	}
	p.setup = function () {

		// change this parameters case by case manually!!!
		let canvasObj = p.createCanvas(840, 681);

		var container = new UI.Panel();
		container.setId( 'p5Canvas' );
		container.setPosition( 'absolute' );
		container.setTop( '32px' );
		container.setRight( '600px' );
		container.setBottom( '32px' );
		container.setLeft( '0px' );
		// container.setOpacity( 0.8 );
		container.dom.style.zIndex = "1";

		document.body.appendChild( container.dom );
		container.dom.appendChild( canvasObj.canvas );

		//initialize our particle system
		ps = new ParticleSystem(0,p.createVector(p.width / 2, p.height - 60),particle_texture);

		max_size = 10;
		counter = 0;
	}

// function draw() {
// 	background('rgba(46,46,46, 0)');
// 	frameRate( 30 );
// 	system.addParticle();
// 	system.run();
// }

	p.draw = function () {
		p.clear();
		p.background('rgba(46,46,46, 0)');

		// background(0);
		var dx = p.map(p.mouseX,0,p.width,-0.2,0.2);
		var wind = p.createVector(dx,0);

		ps.applyForce(wind);
		ps.run();

		console.log('current particle number: ' + ps.particles.length);
		if (counter<max_size) {
			ps.addParticle();
			counter++;
		}
	}

//========= PARTICLE SYSTEM ===========

	/**
	 * A basic particle system class
	 * @param num the number of particles
	 * @param v the origin of the particle system
	 * @param img_ a texture for each particle in the system
	 * @constructor
	 */
	var ParticleSystem = function(num,v,img_) {

		this.particles = [];
		this.origin = v.copy(); // we make sure to copy the vector value in case we accidentally mutate the original by accident
		this.img = img_;
		for(var i = 0; i < num; ++i){
			this.particles.push(new Particle(this.origin,this.img));
		}
	};

	/**
	 * This function runs the entire particle system.
	 */
	ParticleSystem.prototype.run = function() {

		// cache length of the array we're going to loop into a variable
		// You may see <variable>.length in a for loop, from time to time but
		// we cache it here because otherwise the length is re-calculated for each iteration of a loop
		var len = this.particles.length;

		//loop through and run particles
		for (var i = len - 1; i >= 0; i--) {
			var particle = this.particles[i];
			particle.run();

			// if the particle is dead, we remove it.
			// javascript arrays don't have a "remove" function but "splice" works just as well.
			// we feed it an index to start at, then how many numbers from that point to remove.
			if (particle.isDead()) {
				this.particles.splice(i,1);
			}
		}
	}

	/**
	 * Method to add a force vector to all particles currently in the system
	 * @param dir a p5.Vector describing the direction of the force.
	 */
	ParticleSystem.prototype.applyForce = function(dir) {
		var len = this.particles.length;
		for(var i = 0; i < len; ++i){
			this.particles[i].applyForce(dir);
		}
	}

	/**
	 * Adds a new particle to the system at the origin of the system and with
	 * the originally set texture.
	 */
	ParticleSystem.prototype.addParticle = function() {
		this.particles.push(new Particle(this.origin,this.img));
	}

//========= PARTICLE  ===========
	/**
	 *  A simple Particle class, renders the particle as an image
	 */
	var Particle = function (pos, img_) {
		this.loc = pos.copy();

		var vx = p.randomGaussian() * 0.3;
		var vy = p.randomGaussian() * 0.3 - 1.0;

		this.vel = p.createVector(vx,vy);
		this.acc = p.createVector();
		this.lifespan = 1000.0;
		this.texture = img_;
	}

	/**
	 *  Simulataneously updates and displays a particle.
	 */
	Particle.prototype.run = function() {
		this.update();
		this.render();
	}

	/**
	 *  A function to display a particle
	 */
	Particle.prototype.render = function() {
		p.imageMode(p.CENTER);
		p.tint(255,this.lifespan);
		p.image(this.texture,this.loc.x,this.loc.y);
	}

	/**
	 *  A method to apply a force vector to a particle.
	 */
	Particle.prototype.applyForce = function(f) {
		this.acc.add(f);
	}

	/**
	 *  This method checks to see if the particle has reached the end of it's lifespan,
	 *  if it has, return true, otherwise return false.
	 */
	Particle.prototype.isDead = function () {
		if (this.lifespan <= 0.0) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 *  This method updates the position of the particle.
	 */
	Particle.prototype.update = function() {
		this.vel.add(this.acc);
		this.loc.add(this.vel);
		this.lifespan -= 2.5;
		this.acc.mult(0);
	}

};
