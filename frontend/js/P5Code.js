
var P5Layer = function ( p ) {

	let fire_texture = null;

	let container = new UI.Panel();

	let ps = null;

	let signals = editor.signals;

	let runBackground = false;

	let sourceStrokes = null;
	let travelStrokes = null;
	let textureName = null;

	signals.msgBackgroundTexturePattern.add( function ( msg ) {
		// console.log( msg.sourceStrokes );
		// console.log( msg.travelStrokes );
		// console.log( msg.textureName );

		sourceStrokes = msg.sourceStrokes;
		travelStrokes = msg.travelStrokes;
		textureName = msg.textureName;
	} );

	signals.runBackground.add( function ( boo ) {
		if( boo===true ) {
			container.setDisplay('');
			runBackground = true;
		}
		else {
			container.setDisplay('none');
			runBackground = false;
		}
	} );


	p.preload = function () {
		fire_texture = p.loadImage("./asset/background/images/fire_small.png");
	}
	p.setup = function () {

		// change this parameters case by case manually!!!
		let canvasObj = p.createCanvas(840, 681);

		container.setId( 'p5Canvas' );
		container.setPosition( 'absolute' );
		container.setTop( '32px' );
		container.setRight( '600px' );
		container.setBottom( '32px' );
		container.setLeft( '0px' );
		// container.setOpacity( 0.8 );
		container.dom.style.zIndex = "1";
		container.setDisplay( 'none' );

		document.body.appendChild( container.dom );
		container.dom.appendChild( canvasObj.canvas );

		//initialize our particle system
		ps = new ParticleSystem(0,p.createVector(p.width / 2, p.height - 60),fire_texture);
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

		if( runBackground===true ) {
			var dx = p.map(p.mouseX,0,p.width,-0.2,0.2);
			var wind = p.createVector(dx,0);

			ps.applyForce(wind);
			ps.run();
			ps.addParticle();
		}
	}


	class ParticleSystem {
		constructor ( num,v,img_ ) {
			this.particles = [];
			this.origin = v.copy(); // we make sure to copy the vector value in case we accidentally mutate the original by accident
			this.img = img_;
			for(let i = 0; i < num; ++i){
				this.particles.push(new Particle(this.origin,this.img));
			}
		}

		addParticle () {
			this.particles.push(new Particle(this.origin,this.img));
		}

		run () {
			// cache length of the array we're going to loop into a variable
			// You may see <variable>.length in a for loop, from time to time but
			// we cache it here because otherwise the length is re-calculated for each iteration of a loop
			let len = this.particles.length;

			//loop through and run particles
			for (let i = len - 1; i >= 0; i--) {
				let particle = this.particles[i];
				particle.run();

				// if the particle is dead, we remove it.
				// javascript arrays don't have a "remove" function but "splice" works just as well.
				// we feed it an index to start at, then how many numbers from that point to remove.
				if (particle.isDead()) {
					this.particles.splice(i,1);
				}
			}
		}

		applyForce ( dir ) {
			let len = this.particles.length;
			for(let i = 0; i < len; ++i){
				this.particles[i].applyForce(dir);
			}
		}
	}


	class Particle {
		constructor ( pos, img_ ) {
			this.loc = pos.copy();

			let vx = p.randomGaussian() * 0.3;
			let vy = p.randomGaussian() * 0.3 - 1.0;

			this.vel = p.createVector(vx,vy);
			this.acc = p.createVector();
			this.lifespan = 1000.0;
			this.texture = img_;
		}

		run () {
			this.update();
			this.render();
		}

		render () {
			p.imageMode(p.CENTER);
			p.tint(255,this.lifespan);
			p.image(this.texture,this.loc.x,this.loc.y);
		}

		applyForce (f) {
			this.acc.add(f);
		}

		isDead() {
			if (this.lifespan <= 0.0) {
				return true;
			} else {
				return false;
			}
		}

		update () {
			this.vel.add(this.acc);
			this.loc.add(this.vel);
			this.lifespan -= 2.5;
			this.acc.mult(0);
		}
	}
};
