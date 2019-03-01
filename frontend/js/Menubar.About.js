Menubar.About = function (editor) {

    let container = new UI.Panel();
    container.setClass('menu');

    let title = new UI.Panel();
    title.setClass('title');
    title.setTextContent('About');
    title.addClass('h4');
    container.add(title);

    let options = new UI.Panel();
    options.setClass('options');
    container.add(options);

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('Version');
    option.onClick(function () {
    });
    options.add(option);

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('Update');
    option.onClick(function () {
    });
    options.add(option);

    return container;

};
