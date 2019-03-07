"use strict";

var ScriptEditor = function (editor) {
    let container = new UI.Panel();
    container.setId('ScriptEditor');
    container.setPosition('absolute');
    container.setBackgroundColor('rgba(20,20,20,0.5)');
    container.setDisplay('');
    // container.setDisplay( 'none' );
    // container.dom.style.zIndex = "5";

    editor.script_editor = container;

    $(function () {
        editor.quill = new Quill('#ScriptEditor', {
            placeholder: 'Compose an epic...',
            theme: 'bubble'
        });

        // editor.quill.on('text-change', function(delta, oldDelta, source) {
        //     if (source == 'api') {
        //         console.log("An API call triggered this change.");
        //     } else if (source == 'user') {
        //         console.log("A user action triggered this change.");
        //     }
        // });
    });

    return container;
};
