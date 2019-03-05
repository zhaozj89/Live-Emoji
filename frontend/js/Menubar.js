var Menubar = function (editor) {

    var container = new UI.Panel();
    container.setId('menubar');
    container.dom.style.zIndex = "10";

    container.add(new Menubar.Asset(editor));
    container.add(new Menubar.Tool(editor));
    container.add(new Menubar.About(editor));

    return container;

};
