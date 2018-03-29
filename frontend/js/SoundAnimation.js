class SoundPlayer {
	constructor ( playlist ) {
		this.playlist = playlist;
		this.index = 0;
	}

	play ( index ) {
		let self = this;
		let sound;

		index = typeof index === 'number' ? index : self.index;
		let data = self.playlist[ index ];

		if ( data.howl ) {
			sound = data.howl;
		} else {
			sound = data.howl = new Howl( {
				src: [ './asset/audio/' + data.file + '.mp3' ],
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
		}

		sound.play();

		self.index = index;
	}

	pause () {
		let self = this;
		let sound = self.playlist[ self.index ].howl;

		sound.pause();
	}

	skip ( direction ) {
		let self = this;

		let index = 0;
		if ( direction === 'prev' ) {
			index = self.index - 1;
			if ( index < 0 ) {
				index = self.playlist.length - 1;
			}
		} else {
			index = self.index + 1;
			if ( index >= self.playlist.length ) {
				index = 0;
			}
		}

		self.skipTo( index );
	}

	skipTo ( index ) {
		let self = this;

		if ( self.playlist[ self.index ].howl ) {
			self.playlist[ self.index ].howl.stop();
		}

		self.play( index );
	}

	volume ( val ) {
		let self = this;
		Howler.volume( val );
	}

	seek ( per ) {
		let self = this;
		let sound = self.playlist[ self.index ].howl;

		if ( sound.playing() ) {
			sound.seek( sound.duration() * per );
		}
	}

	step () {
		let self = this;

		let sound = self.playlist[ self.index ].howl;

		let seek = sound.seek() || 0;

		if ( sound.playing() ) {
			requestAnimationFrame( self.step.bind( self ) );
		}
	}
}

var SoundAnimation = function ( editor ) {

	let player = new SoundPlayer( [
		{
			title: 'scream',
			file: 'scream',
			howl: null
		}
	] );

	player.play();

	return null;
};
