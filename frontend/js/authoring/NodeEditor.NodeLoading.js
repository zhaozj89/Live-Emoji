"use strict";
var LoadConfigurationJSONFile = function ( editor, filename ) {

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if ( this.readyState == 4 && this.status == 200 ) {
            let jsonFile = JSON.parse( this.responseText );
            ParseTextToEditorAllEmotionCMDs(jsonFile);
            editor.emotionCMDManager.stop();
        }
    };

    xhr.open( 'GET', filename, true );
    xhr.send();
}
