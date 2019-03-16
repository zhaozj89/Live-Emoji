class SoundPlayer {
	constructor (playlist) {
		this.playlist = playlist;
		this.howl_list = {};
	}

	register(name){
		let data = this.playlist[ name ];
		let sound = new Howl( {
			src: [ './asset/audio/' + data + '.mp3' ],
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
	let player = new SoundPlayer({
			'bill': 'bill',
			'burp': 'burp',
			'cry': 'cry',
			'laugh': 'laugh',
			'scream': 'scream',
			'slurp': 'slurp'
		});

	editor.sound_player = player;
}
