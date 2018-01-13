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
				this.left_eye.push( basicElement );
				break;
			}
			case 'left_eyebrow': {
				this.left_eyebrow.push( basicElement );
				break;
			}
			case 'left_red': {
				this.left_red = basicElement;
				break;
			}
			case 'left_mouth': {
				this.left_mouth.push( basicElement );
				break;
			}
			case 'left_nose': {
				this.left_nose.push( basicElement );
				break;
			}
			case 'right_ear': {
				this.right_ear = basicElement;
				break;
			}
			case 'right_eye': {
				this.right_eye.push( basicElement );
				break;
			}
			case 'right_eyebrow': {
				this.right_eyebrow.push( basicElement );
				break;
			}
			case 'right_red': {
				this.right_red = basicElement;
				break;
			}
		}
	}
};

var characterStructure = new CharacterStructure();
