/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Scene = function (editor) {

    var config = editor.config;
    var signals = editor.signals;

    var container = new UI.Panel();
    container.setBorderTop('0');
    container.setPaddingTop('20px');

    return container;

};
