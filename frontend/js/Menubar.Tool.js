Menubar.Tool = function (editor) {
    let container = new UI.Panel();
    container.setClass('menu');

    let title = new UI.Panel();
    title.setClass('title');
    title.setTextContent('Tool');
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
        editor.signals.editEmotionCMD.dispatch();
    });
    options.add(option);

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('Download Arousal');
    option.onClick(function () {

        let rows = editor.allArousals;
        let csvContent = "data:text/csv;charset=utf-8,";
        rows.forEach(function (rowArray) {
            // let row = rowArray.join( "," );
            csvContent += rowArray + "\r\n";
        });

        let encodedUri = encodeURI(csvContent);
        let link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "my_data.csv");
        document.body.appendChild(link);

        link.click();

    });
    options.add(option);

    return container;

};
