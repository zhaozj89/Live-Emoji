var Menubar = function (editor) {

    var container = new UI.Panel();
    container.setId('menubar');
    container.dom.style.zIndex = "10";

    container.add(new Menubar.File(editor));
    container.add(new Menubar.Edit(editor));
    container.add(new Menubar.About(editor));

    return container;

};
