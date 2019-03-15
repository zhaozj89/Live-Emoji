Menubar.Edit = function (editor) {
    let container = new UI.Panel();
    container.setClass('menu');

    let title = new UI.Panel();
    title.setClass('title');
    title.setTextContent('Edit');
    title.addClass('h4');
    container.add(title);

    let options = new UI.Panel();
    options.setClass('options');
    container.add(options);

    //

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('Emotion Editor');
    option.onClick(function () {
        editor.node_editor.setDisplay('');
        editor.script_editor.setDisplay('none');
    });
    options.add(option);

    //
    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('Reset');
    option.onClick(function () {
        if (editor.selected !== null) {
            editor.selected.position.x = 0;
            editor.selected.position.y = 0;
            editor.selected.position.z = 0;
        }
    });
    options.add(option);

    return container;

};
