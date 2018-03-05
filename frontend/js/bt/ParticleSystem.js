class Particle {
	constructor (x,y,obj,editor) {
		this.position = new Vector2(x, y);

		this.lifespan = 255.0;

		this.obj = obj;
		this.editor = editor;

		this.obj.visible = true;
		this.editor.execute( new AddObjectCommand( this.obj ) );
		this.editor.execute( new SetPositionCommand( this.obj, new THREE.Vector3( this.position.x, this.position.y, -5 ) ) );
	}

	run( velocityPathes ) {
		let resVel = new Vector2(0,0);
		for (let prop in velocityPathes) {
			let path = velocityPathes[prop];

			for( let i=0; i<path.length; ++i ) {
				let dist = Math.pow( path[i].position.sub( this.position ).length(), 0.2 );
				resVel.x += path[i].vx / dist;
				resVel.y += path[i].vy / dist;
			}
		}

		console.log( 'Result velocity is: ' + resVel );
		this.position.add(resVel);
		this.lifespan -= 1.0;

		this.editor.signals.animateRender.dispatch();
	}


	isDead() {
		if (this.lifespan < 0.0)
			return true;
		else
			return false;
	}
}

class VelocityPathElement {
	constructor (x,y,vx,vy) {
		this.position = new Vector2(x,y);
		this.vx=vx;
		this.vy=vy;
	}
}

function VelocityPath ( points,
						canvasWidth, canvasHeight,
						width, height) {
	// this.points = points;

	let res=[];

	let sample_size = 21;
	if( points.length>sample_size ) {
		let step = points.length / sample_size;

		for (let k=1; k<sample_size; ++k) {
			let idx = Math.floor( k*step );

			let cur_point = points[idx];
			let pre_point = points[idx-1];

			let velocity = new Vector2(0,0);
			velocity.x = ( cur_point.x - pre_point.x )*width / canvasWidth;
			velocity.y = ( cur_point.y - pre_point.y )*height / canvasHeight;

			velocity.normalize();

			let el = new VelocityPathElement(cur_point.x*width/canvasWidth, cur_point.y*height/canvasHeight, velocity.x, velocity.y);
			res.push(el);
		}
	}

	return res;
}


class ParticleSystem {

	constructor ( sourceStrokes, travelStrokes, obj, editor,
				  canvasWidth, canvasHeight,
				  width, height) {
		this.particles = [];
		this.obj = obj;

		let start_point = new Vector2(0,0);
		for (let prop in sourceStrokes) {
			let current_stroke = sourceStrokes[prop];
			for(let i=0; i<current_stroke.length; ++i) {
				let current_point = current_stroke[i];
				start_point.x += ( current_point.x * width) /canvasWidth;
				start_point.y += ( current_point.y * height) / canvasHeight;
			}
			start_point = start_point.divideScalar( current_stroke.length );
			console.log( 'start point: ' + start_point );
		}

		this.start_point = start_point;

		this.editor = editor;


		// generate velocity path
		this.velocityPathes = {};
		for (let prop in travelStrokes) {
			let current_stroke = travelStrokes[prop];
			let path = VelocityPath( current_stroke,
				canvasWidth, canvasHeight,
				width, height );
			if(path.length===[]) continue;
			this.velocityPathes[prop] = path;
		}
	}

	addParticle() {
		// add particle
		let newObj = this.obj.clone();
		let newParticle = new MyParticle( this.start_point.x, this.start_point.y, newObj, this.editor );
		this.particles.push( newParticle );
	}

	run() {
		for (let i = this.particles.length-1; i >= 0; i--) {
			this.particles[i].run( this.velocityPathes );
			if (this.particles[i].isDead()) {
				this.editor.execute( new RemoveObjectCommand( this.particles[i].obj ) );
				this.particles.pop();
			}
		}
	}
}