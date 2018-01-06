

class Trigger extends Node {
  constructor ( value ) {
    super( NODE_TYPE.TRIGGER, value, true );

    switch ( value ) {
      case 'keyboard': {
        this.addInput( INPUT_TYPE.INPUT_KEY, 'key');
        break;
      }

      case 'emotion': {
        this.addInput( INPUT_TYPE.SELECT_EMOTION, 'emotion' );
        break;
      }
    }
  }
}
