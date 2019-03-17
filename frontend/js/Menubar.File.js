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
        let text_file = JSON.stringify(editor.emotionCMDManager);
        let send_file = JSON.parse(text_file);

        $.ajax({
            type: 'POST',
            url: '/export',//url of receiver file on server
            data: send_file,
            dataType: "json",
            complete: function (data) {
                alert('Save story succeed!');
            }
        });

        // function download(text, name, type) {
        //     let a = document.createElement("a");
        //     let file = new Blob([text], {type: type});
        //     let url = URL.createObjectURL(file);
        //     console.log(url);
        //     a.href = url;
        //     a.download = name;
        //     a.click();
        //
        //     // setTimeout(function() {
        //     //     document.body.removeChild(a);
        //     //     window.URL.revokeObjectURL(url);
        //     // }, 0);
        // }
        //
        // download(text_file, 'test.json', 'text/plain');
    });
    options.add(option);

    // auto-save
    setInterval(function(){
        let text_file = JSON.stringify(editor.emotionCMDManager);
        let send_file = JSON.parse(text_file);

        $.ajax({
            type: 'POST',
            url: '/export',//url of receiver file on server
            data: send_file,
            dataType: "json"
        });
    }, 10000);

    return container;

};
