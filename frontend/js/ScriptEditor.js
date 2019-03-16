"use strict";

var ScriptEditor = function (editor) {
    let container = new UI.Panel();
    container.setId('ScriptEditor');
    container.setPosition('absolute');
    container.setBackgroundColor('rgba(20,20,20,0.5)');
    container.setDisplay('none');
    // container.setDisplay( 'none' );
    container.dom.style.zIndex = "0";

    editor.script_editor = container;

    $(function () {
        editor.quill = new Quill('#ScriptEditor', {
            placeholder: 'Compose an epic...',
            theme: 'bubble'
        });
    });

    return container;
};
