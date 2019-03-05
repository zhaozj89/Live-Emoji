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