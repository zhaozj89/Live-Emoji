function _GenerateEmotionCMDUUID(seed)
{
    // return uuidv5(seed, uuidv5.URL); // -> v5 UUID
    return UUID.generate();
}

var CreateNECanvas = function (editor) {
    let node_editor_canvas = new UI.Canvas();
    node_editor_canvas.setId('editor_canvas');
    editor.node_editor.add(node_editor_canvas);
    editor.node_editor_canvas = node_editor_canvas;
}

var ResizeNECanvas = function (editor) {
    editor.node_editor_canvas.dom.width = editor.main_view.dom.clientWidth;
    editor.node_editor_canvas.dom.height = editor.main_view.dom.clientHeight - 44;
    editor.node_editor_canvas.dom.style.width = editor.main_view.dom.clientWidth + 'px';
    editor.node_editor_canvas.dom.style.height = editor.main_view.dom.clientHeight - 44 + 'px';
}

var ParseTextToEditorAllEmotionCMDs = function(jsonFile)
{
    editor.emotionCMDManager.fromJSON( jsonFile );

    for ( let prop in editor.emotionCMDManager.all_emotion_cmds) {
        let cmd = editor.emotionCMDManager.all_emotion_cmds[prop];
        let info = {uuid: prop, name: cmd.getName()};
        editor.signals.saveEmotionCMD.dispatch( info );
    }
}

var SaveAEmotionCMD = function (cmd){
    if(cmd!=null){
        let uuid = cmd.getUUID();
        if(uuid==null) {
            uuid = _GenerateEmotionCMDUUID(JSON.stringify(cmd.getGraph().serialize())+editor.GlobalCounter);
            editor.GlobalCounter+=1;
            cmd.setUUID(uuid);
            editor.emotionCMDManager.save(uuid, cmd);
            editor.signals.saveEmotionCMD.dispatch({uuid: cmd.uuid, name: cmd.name});
        }else{
            editor.emotionCMDManager.save(uuid, cmd);
        }
    }
}


var RenewAGraph = function (){
    $('#editor_canvas').remove();
    CreateNECanvas(editor);
    ResizeNECanvas(editor);

    if(editor.emotionCMDManager.current_emotion_cmd!=null)
        editor.emotionCMDManager.current_emotion_cmd.stop();
    editor.emotionCMDManager.current_emotion_cmd = new EmotionCMD();
    editor.emotionCMDManager.emotion_canvas = new LGraphCanvas("#editor_canvas", editor.emotionCMDManager.current_emotion_cmd.getGraph());
    editor.emotionCMDManager.current_emotion_cmd.start();
}