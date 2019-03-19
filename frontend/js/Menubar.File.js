Menubar.File = function (editor) {

    let container = new UI.Panel();
    container.setClass('menu');

    let title = new UI.Panel();
    title.setClass('title');
    title.setTextContent('File');
    title.addClass('h4');
    container.add(title);

    let options = new UI.Panel();
    options.setClass('options');
    container.add(options);

    //

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('Load Boy');
    option.onClick(function () {
        PreLoadCharacterJSON(editor, 'boy');
    });
    options.add(option);

    //

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('Load Girl');
    option.onClick(function () {
        PreLoadCharacterJSON(editor, 'girl');
    });
    options.add(option);

    //

    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('Import Story');
    let form = document.createElement('form');
    form.style.display = 'none';
    document.body.appendChild(form);
    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.addEventListener('change', function (event) {

        let file = fileInput.files[0];

        let reader = new FileReader();

        reader.addEventListener('load', function (event) {
            let jsonFile = JSON.parse( event.target.result );
            ParseTextToEditorAllEmotionCMDs(jsonFile);
            editor.emotionCMDManager.stop();
            if(editor.current_emotion_cmd!=null)editor.current_emotion_cmd.start();
        });
        reader.readAsText(file);
        form.reset();

    });
    form.appendChild(fileInput);
    option.onClick(function () {
        fileInput.click();
    });
    options.add(option);


    //
    var option = new UI.Row();
    option.setClass('option');
    option.setTextContent('Export Story');
    option.onClick(function () {
        $.ajax({
            type: 'POST',
            url: '/export',//url of receiver file on server
            data: JSON.stringify(editor.emotionCMDManager),
            contentType: "application/json",
            complete: function (data) {
                alert('Save story succeed!');
            }
        });
    });
    options.add(option);

    return container;

};
