class BasicElement {
	constructor ( name, mesh, emotion ) {
		this.name = name;
		this.mesh = mesh;
		this.emotion = emotion;
	}
};

function CharacterStructure ( name ) {
	THREE.Group.call( this );

	this.name = name;
	this.emotion = 'neutral';

	this.add2Scene = new signals.Signal();
	this.isCompleted = 0;

	this.left_eye_mesh = new THREE.Group();
	this.left_eye_mesh.name = 'left_eye';
	this.left_eyebrow_mesh = new THREE.Group();
	this.left_eyebrow_mesh.name = 'left_eyebrow';
	this.right_eye_mesh = new THREE.Group();
	this.right_eye_mesh.name = 'right_eye';
	this.right_eyebrow_mesh = new THREE.Group();
	this.right_eyebrow_mesh.name = 'right_eyebrow';
	this.nose_mesh = new THREE.Group();
	this.nose_mesh.name = 'nose';
	this.mouth_mesh = new THREE.Group();
	this.mouth_mesh.name = 'mouth';

	this.add( this.left_eye_mesh );
	this.add( this.left_eyebrow_mesh );
	this.add( this.right_eye_mesh );
	this.add( this.right_eyebrow_mesh );
	this.add( this.nose_mesh );
	this.add( this.mouth_mesh );

	this.accessory = null;
	this.face = null;
	this.left_ear = null;

	this.left_eye = [];
	this.left_eyebrow = [];

	this.left_red = null;

	this.mouth = [];
	this.nose = [];

	this.right_ear = null;

	this.right_eye = [];
	this.right_eyebrow = [];

	this.right_red = null;

	this.left_eye_close = false;
	this.right_eye_close = false;

	this.mouth_open = false;
}

CharacterStructure.prototype = Object.create( THREE.Group.prototype );
CharacterStructure.prototype.constructor = CharacterStructure;

CharacterStructure.prototype.check = function () {
	if ( this.isCompleted === 51 ) {
		this.add2Scene.dispatch( this );
	}
};

CharacterStructure.prototype.addElement = function ( basicElement ) {
	switch ( basicElement.name ) {
		case 'accessory': {
			basicElement.mesh.position.z -= 0.2;
			this.accessory = basicElement;
			this.add( basicElement.mesh );

			this.isCompleted++;
			this.check();
			break;
		}
		case 'face': {
			this.face = basicElement;
			this.add( basicElement.mesh );

			this.isCompleted++;
			this.check();
			break;
		}
		case 'left_ear': {
			this.left_ear = basicElement;
			this.add( basicElement.mesh );

			this.isCompleted++;
			this.check();
			break;
		}
		case 'left_eye': {
			basicElement.mesh.position.z -= 0.1;
			if ( basicElement.emotion !== this.emotion ) basicElement.mesh.visible = false;

			// // test
			// if( basicElement.emotion === 'close' ) basicElement.mesh.visible = true;
			// else basicElement.mesh.visible = false;

			this.left_eye.push( basicElement );
			this.left_eye_mesh.add( basicElement.mesh );

			this.isCompleted++;
			this.check(); // 3+7
			break;
		}
		case 'left_eyebrow': {
			basicElement.mesh.position.z -= 0.1;
			if ( basicElement.emotion !== this.emotion ) basicElement.mesh.visible = false;
			this.left_eyebrow.push( basicElement );
			this.left_eyebrow_mesh.add( basicElement.mesh );

			this.isCompleted++;
			this.check(); // 3+7*2
			break;
		}
		case 'left_red': {
			basicElement.mesh.position.z -= 0.1;
			this.left_red = basicElement;
			this.add( basicElement.mesh );

			this.isCompleted++;
			this.check(); // 4+7*2
			break;
		}
		case 'mouth': {
			basicElement.mesh.position.z -= 0.1;
			if ( basicElement.emotion !== this.emotion ) basicElement.mesh.visible = false;
			// if( basicElement.emotion === 'open' )
			// 	basicElement.mesh.visible = true;
			// else
			// 	basicElement.mesh.visible = false;

			this.mouth.push( basicElement );
			this.mouth_mesh.add( basicElement.mesh );

			this.isCompleted++;
			this.check(); // 4+7*3
			break;
		}
		case 'nose': {
			basicElement.mesh.position.z -= 0.1;
			if ( basicElement.emotion !== this.emotion ) basicElement.mesh.visible = false;
			this.nose.push( basicElement );
			this.nose_mesh.add( basicElement.mesh );

			this.isCompleted++;
			this.check(); // 4+7*4
			break;
		}
		case 'right_ear': {
			basicElement.mesh.position.z -= 0.1;
			this.right_ear = basicElement;
			this.add( basicElement.mesh );

			this.isCompleted++;
			this.check(); // 5+7*4
			break;
		}
		case 'right_eye': {
			basicElement.mesh.position.z -= 0.1;
			if ( basicElement.emotion !== this.emotion ) basicElement.mesh.visible = false;

			// // test
			// if( basicElement.emotion === 'close' ) basicElement.mesh.visible = true;
			// else basicElement.mesh.visible = false;

			this.right_eye.push( basicElement );
			this.right_eye_mesh.add( basicElement.mesh );

			this.isCompleted++;
			this.check(); // 5+7*5
			break;
		}
		case 'right_eyebrow': {
			basicElement.mesh.position.z -= 0.1;
			if ( basicElement.emotion !== this.emotion ) basicElement.mesh.visible = false;
			this.right_eyebrow.push( basicElement );
			this.right_eyebrow_mesh.add( basicElement.mesh );

			this.isCompleted++;
			this.check(); // 5+7*6
			break;
		}
		case 'right_red': {
			basicElement.mesh.position.z -= 0.1;
			this.right_red = basicElement;
			this.add( basicElement.mesh );

			this.isCompleted++;
			this.check(); // 6+7*6
			break;
		}
	}
};


CharacterStructure.prototype.updateEmotion = function ( emotion ) {
	for ( let i = 0; i < Object.keys( EMOTION_TYPE ).length; ++i ) {

		this.left_eyebrow[ i ].mesh.visible = false;
		if ( this.left_eyebrow[ i ].emotion === emotion ) this.left_eyebrow[ i ].mesh.visible = true;

		this.right_eyebrow[ i ].mesh.visible = false;
		if ( this.right_eyebrow[ i ].emotion === emotion ) this.right_eyebrow[ i ].mesh.visible = true;

		this.nose[ i ].mesh.visible = false;
		if ( this.nose[ i ].emotion === emotion ) this.nose[ i ].mesh.visible = true;
	}

	for ( let i = 0; i < Object.keys( EMOTION_TYPE ).length+1; ++i ) {

		if ( this.left_eye[ i ].emotion === emotion ) {
			if( this.left_eye_close === false ) {
				this.left_eye[ i ].mesh.visible = true;
			}
		}
		else {
			if( this.left_eye_close === false ) {
				this.left_eye[ i ].mesh.visible = false;
			}
		}

		if ( this.right_eye[ i ].emotion === emotion ) {
			if( this.right_eye_close === false ) {
				this.right_eye[ i ].mesh.visible = true;
			}
		}
		else {
			if( this.right_eye_close === false ) {
				this.right_eye[ i ].mesh.visible = false;
			}
		}

		if ( this.mouth[ i ].emotion === emotion ) {
			if( this.mouth_open === false ) {
				this.mouth[ i ].mesh.visible = true;
			}
		}
		else {
			if( this.mouth_open === false ) {
				this.mouth[ i ].mesh.visible = false;
			}
		}
	}
};

CharacterStructure.prototype.updateLeftEye = function ( state ) {

	if ( state === 'close' ) {
		for ( let i = 0; i < Object.keys( EMOTION_TYPE ).length + 1; ++i ) {
			if ( this.left_eye[ i ].emotion === 'close' ) {
				this.left_eye[ i ].mesh.visible = true;
				this.left_eye_close = true;
			}
			else {
				this.left_eye[ i ].mesh.visible = false;
			}
		}
	}
	else {
		for ( let i = 0; i < Object.keys( EMOTION_TYPE ).length + 1; ++i ) {
			if ( this.left_eye[ i ].emotion === this.emotion ) {
				this.left_eye[ i ].mesh.visible = true;
				this.left_eye_close = false;
			}
			else {
				this.left_eye[ i ].mesh.visible = false;
			}
		}
	}
};

CharacterStructure.prototype.updateRightEye = function ( state ) {

	if ( state === 'close' ) {
		for ( let i = 0; i < Object.keys( EMOTION_TYPE ).length + 1; ++i ) {
			if ( this.right_eye[ i ].emotion === 'close' ) {
				this.right_eye[ i ].mesh.visible = true;
				this.right_eye_close = true;
			}
			else {
				this.right_eye[ i ].mesh.visible = false;
			}
		}
	}
	else {
		for ( let i = 0; i < Object.keys( EMOTION_TYPE ).length + 1; ++i ) {
			if ( this.right_eye[ i ].emotion === this.emotion ) {
				this.right_eye[ i ].mesh.visible = true;
				this.right_eye_close = false;
			}
			else {
				this.right_eye[ i ].mesh.visible = false;
			}
		}
	}
};

CharacterStructure.prototype.updateMouth = function ( state ) {

	if( state === 'open' ) {
		for ( let i = 0; i < Object.keys( EMOTION_TYPE ).length + 1; ++i ) {
			if ( this.mouth[ i ].emotion === 'open' ) {
				this.mouth[ i ].mesh.visible = true;
				this.mouth_open = true;
			}
			else {
				this.mouth[ i ].mesh.visible = false;
			}
		}
	}
	else {
		for ( let i = 0; i < Object.keys( EMOTION_TYPE ).length + 1; ++i ) {
			if ( this.mouth[ i ].emotion === this.emotion ) {
				this.mouth[ i ].mesh.visible = true;
				this.mouth_open = false;
			}
			else {
				this.mouth[ i ].mesh.visible = false;
			}
		}
	}
}
