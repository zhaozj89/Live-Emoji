class MyParticle {
	constructor ( x, y, /*theta,*/ dx, dy, /*dtheta,*/ numParticles ) {
		this.x = x;
		this.y = y;
		// this.theta = theta;
		this.dx = dx;
		this.dy = dy;
		// this.dtheta = dtheta;

		this.numParticles = numParticles;
		this.weight = 1.0 / numParticles;
	}

	predict ( gaussianX, gaussianY, /*gaussianTheta,*/ dt ) {
		this.dx = gaussianX.ppf( Math.random() );
		this.dy = gaussianY.ppf( Math.random() );
		// this.dtheta = gaussianTheta.ppf( Math.random() );

		this.x += this.dx * dt;
		this.y += this.dy * dt;
		// this.theta += this.dtheta * dt;
	}

	clone () {
		let copy = new MyParticle( this.x, this.y, /*this.theta,*/ this.dx, this.dy, /*this.dtheta,*/ this.numParticles );
		return copy;
	}
}

class ParticleFilter {
	constructor () {
	}

	init ( width, height, numParticles, dt ) {
		this.width = width;
		this.height = height;
		this.numParticles = numParticles;
		this.dt = dt;

		this.x = width / 2;
		this.y = height / 2;
		// this.theta = 0;

		this.gaussianX = gaussian( 0, width / 2 );
		this.gaussianY = gaussian( 0, height / 2 );
		// this.gaussianTheta = gaussian( 0, 90 );

		this.particles = [];
		for ( let i = 0; i < numParticles; ++i ) {
			let particle = new MyParticle( this.x, this.y, /*this.theta,*/ 0, 0, /*this.dtheta,*/ this.numParticles );
			this.particles.push( particle );
		}
	}

	predict () {
		let x = 0;
		let y = 0;
		// let theta = 0;
		for ( let i = 0; i < this.numParticles; ++i ) {
			this.particles[ i ].predict( this.gaussianX, this.gaussianY, /*this.gaussianTheta,*/ this.dt );

			x += this.particles[ i ].x * this.particles[ i ].weight;
			y += this.particles[ i ].y * this.particles[ i ].weight;
			// theta += this.particles[ i ].theta * this.particles[ i ].weight;
		}

		this.x = x;
		this.y = y;
		// this.theta = theta;

		return {
			'x': x,
			'y': y
			// 'theta': theta
		};
	}

	correct ( x, y /*theta*/ ) {

		let sumWeight = 0;
		for ( let i = 0; i < this.numParticles; ++i ) {
			let distX2 = ( this.particles[ i ].x - x ) * ( this.particles[ i ].x - x ) / this.width / this.width;
			let distY2 = ( this.particles[ i ].y - y ) * ( this.particles[ i ].y - y ) / this.height / this.height;
			// let distTheta2 = ( this.particles[ i ].theta - theta ) * ( this.particles[ i ].theta - theta );

			let weight = Math.exp( -0.5 * ( distX2 + distY2 /*+ distTheta2*/ ) );
			sumWeight += weight;
			this.particles[ i ].weight = weight;
		}

		// SIR

		// normalization & cumulation
		let cumprob = [];
		let preprob = 0;
		for ( let i = 0; i < this.numParticles; ++i ) {
			this.particles[ i ].weight /= sumWeight;
			cumprob.push( this.particles[ i ].weight + preprob );
			preprob += this.particles[ i ].weight;
		}

		// resampling
		let resIndices = new Array( this.numParticles );

		let i = 0;
		let u0 = Math.random() / this.numParticles;
		for ( let j = 0; j < this.numParticles; ++j ) {
			let uj = u0 + j/this.numParticles;

			while ( uj > cumprob[ i ] ) {
				i = i + 1;
			}

			resIndices[ j ] = i;
		}

		// reassign particles
		let resX = 0;
		let resY = 0;
		// let theta = 0;

		let particles = [];
		for ( let i = 0; i < this.numParticles; ++i ) {
			let particle = this.particles[ resIndices[ i ] ].clone();
			particles.push( particle );

			resX += particle.x * particle.weight;
			resY += particle.y * particle.weight;
			// theta += particle.theta * particle.weight;
		}

		this.particles = particles;

		this.x = resX;
		this.y = resY;
		// this.theta = theta;

		return {
			'x': resX,
			'y': resY
			// 'theta': theta
		};
	}
}