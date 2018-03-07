
var P5Layer = function ( p ) {

	let fire_texture = null;

	let container = new UI.Panel();

	let ps = null;

	let signals = editor.signals;

	let displayP5Canvas = false;

	let sourceStrokes = null;
	let travelStrokes = null;
	let textureName = null;

	signals.msgTextureInfo.add( function ( msg ) {
		// console.log( msg.sourceStrokes );
		// console.log( msg.travelStrokes );
		// console.log( msg.textureName );

		sourceStrokes = msg.sourceStrokes;
		travelStrokes = msg.travelStrokes;
		textureName = msg.textureName;
	} );

	signals.displayP5Canvas.add( function ( boo ) {
		if( boo===true ) {
			container.setDisplay('');
			displayP5Canvas = true;
		}
		else {
			container.setDisplay('none');
			displayP5Canvas = false;
		}
	} );


	p.preload = function () {
		fire_texture = p.loadImage("./asset/background/images/small/fire_small.png");
		heart_texture = p.loadImage("./asset/background/images/small/heart_small.png");
		poop_texture = p.loadImage("./asset/background/images/small/poop_small.png");
		raindrop_texture = p.loadImage("./asset/background/images/small/raindrop_small.png");
		splatter1_texture = p.loadImage("./asset/background/images/small/splatter1_small.png");
		splatter2_texture = p.loadImage("./asset/background/images/small/splatter2_small.png");
		surprised_texture = p.loadImage("./asset/background/images/small/surprised_small.png");
		yellowbubble_texture = p.loadImage("./asset/background/images/small/yellowbubble_small.png");
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
		ps = new ParticleSystem();
	}

	p.draw = function () {
		// 	frameRate( 30 );
		p.clear();
		p.background('rgba(46,46,46, 0)');

		if( displayP5Canvas===true ) {
			if(sourceStrokes!==null) {
				let texture = null;
				switch (textureName) {
					case 'fire': {
						texture = fire_texture;
						break;
					}
					case 'heart': {
						texture = heart_texture;
						break;
					}
					case 'poop': {
						texture = poop_texture;
						break;
					}
					case 'raindrop': {
						texture = raindrop_texture;
						break;
					}
					case 'splatter1': {
						texture = splatter1_texture;
						break;
					}
					case 'splatter2': {
						texture = splatter2_texture;
						break;
					}
					case 'surprised': {
						texture = surprised_texture;
						break;
					}
					case 'yellowbubble': {
						texture = yellowbubble_texture;
						break;
					}
				}
				ps.updateSystemInfo( sourceStrokes, texture );

				var dx = p.map(p.mouseX,0,p.width,-0.2,0.2);
				var wind = new Vector2(dx,0);

				ps.applyForce(wind);
				ps.run();
				ps.addParticle();
			}
		}
	}


	class ParticleSystem {
		constructor ( num,v,img_ ) {
			this.particles = [];
		}

		updateSystemInfo ( sourceStrokes, image ) {
			this.sourceStrokes = sourceStrokes;
			this.img = image;
		}

		addParticle () {
			for (let prop in this.sourceStrokes) {
				let strokePoints = sourceStrokes[prop];

				// sampling
				let sample_size = 21;
				if( strokePoints.length>sample_size ) {
					let step = strokePoints.length / sample_size;

					for (let k=1; k<sample_size; ++k) {
						let idx = Math.floor( k*step );

						let cur_point = strokePoints[idx];

						if( this.particles.length<50 )
							this.particles.push(new Particle(cur_point, this.img));
					}
				}
			}
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
		constructor ( pos, image ) {
			this.loc = pos.clone();

			let vx = p.randomGaussian() * 0.3;
			let vy = p.randomGaussian() * 0.3 - 1.0;

			this.vel = new Vector2(vx,vy);
			this.acc = new Vector2(0,0);
			this.lifespan = 800.0;
			this.texture = image;
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
			this.acc = this.acc.add(f);
		}

		isDead() {
			if (this.lifespan <= 0.0) {
				return true;
			} else {
				return false;
			}
		}

		update () {
			this.vel = this.vel.add(this.acc);
			this.loc = this.loc.add(this.vel);
			this.lifespan -= 2.5;
			this.acc = this.acc.multiplyScalar(0);
		}
	}
};
