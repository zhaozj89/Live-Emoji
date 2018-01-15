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

		this.right_red = [];

		///
		this.emotion = 'neutral';
	}

	addElement( basicElement ) {
		switch( basicElement.name ) {
			case 'accessory': {
				basicElement.mesh.position.y += 0.2;
				this.accessory = basicElement;
				break;
			}
			case 'face': {
				this.face = basicElement;
				break;
			}
			case 'left_ear': {
				this.left_ear = basicElement;
				break;
			}
			case 'left_eye': {
				basicElement.mesh.position.y += 0.1;
				if( basicElement.emotion !== this.emotion ) basicElement.mesh.visible = false;
				this.left_eye.push( basicElement );
				break;
			}
			case 'left_eyebrow': {
				basicElement.mesh.position.y += 0.1;
				if( basicElement.emotion !== this.emotion ) basicElement.mesh.visible = false;
				this.left_eyebrow.push( basicElement );
				break;
			}
			case 'left_red': {
				basicElement.mesh.position.y += 0.1;
				this.left_red = basicElement;
				break;
			}
			case 'mouth': {
				basicElement.mesh.position.y += 0.1;
				if( basicElement.emotion !== this.emotion ) basicElement.mesh.visible = false;
				this.mouth.push( basicElement );
				break;
			}
			case 'nose': {
				basicElement.mesh.position.y += 0.1;
				if( basicElement.emotion !== this.emotion ) basicElement.mesh.visible = false;
				this.nose.push( basicElement );
				break;
			}
			case 'right_ear': {
				basicElement.mesh.position.y += 0.1;
				this.right_ear = basicElement;
				break;
			}
			case 'right_eye': {
				basicElement.mesh.position.y += 0.1;
				if( basicElement.emotion !== this.emotion ) basicElement.mesh.visible = false;
				this.right_eye.push( basicElement );
				break;
			}
			case 'right_eyebrow': {
				basicElement.mesh.position.y += 0.1;
				if( basicElement.emotion !== this.emotion ) basicElement.mesh.visible = false;
				this.right_eyebrow.push( basicElement );
				break;
			}
			case 'right_red': {
				basicElement.mesh.position.y += 0.1;
				this.right_red = basicElement;
				break;
			}
		}
	}
};

var characterStructure = new CharacterStructure();
