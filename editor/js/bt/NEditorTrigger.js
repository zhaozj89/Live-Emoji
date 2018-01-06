

class Trigger extends Node {
  constructor ( value ) {
    super( NODE_TYPE.TRIGGER, value, true );

    switch ( value ) {
      case 'keyboard': {
        this.addInput( INPUT_TYPE.INPUT, 'key');
        break;
      }

      case 'emotion': {
        this.addInput( INPUT_TYPE.SELECTMENU, 'emotion' );
        break;
      }
    }
  }
}
