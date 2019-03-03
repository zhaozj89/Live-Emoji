"use strict";
var LoadEmotionCMDJSONFile = function ( editor, filename ) {

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if ( this.readyState == 4 && this.status == 200 ) {
            let jsonFile = JSON.parse( this.responseText );

            editor.emotionCMDManager.fromJSON( jsonFile );

            for ( let prop in editor.emotionCMDManager.all_emotion_cmds) {

                let info = editor.emotionCMDManager.all_emotion_cmds[ prop ].getInfo();
                editor.signals.saveEmotionCMD.dispatch( info );
            }
        }
    };

    xhr.open( 'GET', './asset/' + filename, true );
    xhr.send();
}
