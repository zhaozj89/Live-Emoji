class BasicElement  {
	constructor( name, mesh, emotion ) {
		this.name = name;
		this.mesh = mesh;
		this.position = null;
		this.visible = null;
		this.emotion = emotion;
	}
};


class CharacterStructure  {
	constructor() {

		this.add2Scene = new signals.Signal();
		this.isCompleted = 0;

		this.character_mesh = new THREE.Group();
		this.left_eye_mesh = new THREE.Group();			this.left_eye_mesh.name = 'left_eye';
		this.left_eyebrow_mesh = new THREE.Group(); 	this.left_eyebrow_mesh.name = 'left_eyebrow';
		this.right_eye_mesh = new THREE.Group();		this.right_eye_mesh.name = 'right_eye';
		this.right_eyebrow_mesh = new THREE.Group();	this.right_eyebrow_mesh.name = 'right_eyebrow';
		this.nose_mesh = new THREE.Group();				this.nose_mesh.name = 'nose';
		this.mouth_mesh = new THREE.Group();			this.mouth_mesh.name = 'mouth';

		this.character_mesh.add( this.left_eye_mesh );
		this.character_mesh.add( this.left_eyebrow_mesh );
		this.character_mesh.add( this.right_eye_mesh );
		this.character_mesh.add( this.right_eyebrow_mesh );
		this.character_mesh.add( this.nose_mesh );
		this.character_mesh.add( this.mouth_mesh );

		this.emotion = 'sad';



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
	}

	check() {
		if( this.isCompleted===48 ) {
			// this.character_mesh.position.x -= 0.5;
			// this.character_mesh.position.y -= 0.5;
			this.add2Scene.dispatch( this.character_mesh );
		}
	}

	addElement( basicElement ) {
		switch( basicElement.name ) {
			case 'accessory': {
				basicElement.mesh.position.z -= 0.2;
				this.accessory = basicElement;
				this.character_mesh.add( basicElement.mesh );

				this.isCompleted++;
				this.check();
				break;
			}
			case 'face': {
				this.face = basicElement;
				this.character_mesh.add( basicElement.mesh );

				this.isCompleted++;
				this.check();
				break;
			}
			case 'left_ear': {
				this.left_ear = basicElement;
				this.character_mesh.add( basicElement.mesh );

				this.isCompleted++;
				this.check();
				break;
			}
			case 'left_eye': {
				basicElement.mesh.position.z -= 0.1;
				if( basicElement.emotion !== this.emotion ) basicElement.mesh.visible = false;
				this.left_eye.push( basicElement );
				this.left_eye_mesh.add( basicElement.mesh );

				this.isCompleted++;
				this.check(); // 3+7
				break;
			}
			case 'left_eyebrow': {
				basicElement.mesh.position.z -= 0.1;
				if( basicElement.emotion !== this.emotion ) basicElement.mesh.visible = false;
				this.left_eyebrow.push( basicElement );
				this.left_eyebrow_mesh.add( basicElement.mesh );

				this.isCompleted++;
				this.check(); // 3+7*2
				break;
			}
			case 'left_red': {
				basicElement.mesh.position.z -= 0.1;
				this.left_red = basicElement;
				this.character_mesh.add( basicElement.mesh );

				this.isCompleted++;
				this.check(); // 4+7*2
				break;
			}
			case 'mouth': {
				basicElement.mesh.position.z -= 0.1;
				if( basicElement.emotion !== this.emotion ) basicElement.mesh.visible = false;
				this.mouth.push( basicElement );
				this.mouth_mesh.add( basicElement.mesh );

				this.isCompleted++;
				this.check(); // 4+7*3
				break;
			}
			case 'nose': {
				basicElement.mesh.position.z -= 0.1;
				if( basicElement.emotion !== this.emotion ) basicElement.mesh.visible = false;
				this.nose.push( basicElement );
				this.nose_mesh.add( basicElement.mesh );

				this.isCompleted++;
				this.check(); // 4+7*4
				break;
			}
			case 'right_ear': {
				basicElement.mesh.position.z -= 0.1;
				this.right_ear = basicElement;
				this.character_mesh.add( basicElement.mesh );

				this.isCompleted++;
				this.check(); // 5+7*4
				break;
			}
			case 'right_eye': {
				basicElement.mesh.position.z -= 0.1;
				if( basicElement.emotion !== this.emotion ) basicElement.mesh.visible = false;
				this.right_eye.push( basicElement );
				this.right_eye_mesh.add( basicElement.mesh );

				this.isCompleted++;
				this.check(); // 5+7*5
				break;
			}
			case 'right_eyebrow': {
				basicElement.mesh.position.z -= 0.1;
				if( basicElement.emotion !== this.emotion ) basicElement.mesh.visible = false;
				this.right_eyebrow.push( basicElement );
				this.right_eyebrow_mesh.add( basicElement.mesh );

				this.isCompleted++;
				this.check(); // 5+7*6
				break;
			}
			case 'right_red': {
				basicElement.mesh.position.z -= 0.1;
				this.right_red = basicElement;
				this.character_mesh.add( basicElement.mesh );

				this.isCompleted++;
				this.check(); // 6+7*6
				break;
			}
		}
	}



	// world2Local( position ) {
	//
	// }

};

var characterStructure = new CharacterStructure();
characterStructure.add2Scene.add( function ( obj ) {
	editor.execute( new AddObjectCommand( obj ) );
} );
