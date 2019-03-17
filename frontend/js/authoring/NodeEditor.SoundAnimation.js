class SoundPlayer {
	constructor () {
		this.howl_list = {};
	}

	register(name){
		if(this.howl_list.hasOwnProperty(name)) return;
		console.log('registered');
		let sound = new Howl( {
			src: [ './asset/audio/' + name + '.mp3' ],
			html5: true,
			onplay: function () {
			},
			onload: function () {
			},
			onend: function () {
			},
			onpause: function () {
			},
			onstop: function () {
			}
		} );
		console.log(sound);
		this.howl_list[name] = sound;
	}

	play ( name ) {
		this.howl_list[name].play();
	}

	pause (name) {
		if(this.howl_list.hasOwnProperty(name)){
			let sound = this.howl_list[name];
			sound.pause();
		}
	}

	volume ( val ) {
		Howler.volume( val );
	}
}

var SoundAnimation = function (editor) {
	let player = new SoundPlayer();
	editor.sound_player = player;
}
