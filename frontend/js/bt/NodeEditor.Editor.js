"use strict";

var NodeEditor = function (editor) {
    let container = new UI.Panel();
    container.setId('nodeEditor');
    container.setPosition('absolute');
    container.setBackgroundColor('rgba(20,20,20,0.5)');
    container.setDisplay('');
    // container.setDisplay( 'none' );
    // container.dom.style.zIndex = "5";

    editor.node_editor = container;

    var header = new UI.Panel();
    header.setPadding('10px');
    container.add(header);

    var title = new UI.Text().setColor('#fff');
    header.add(title);

    var buttonSVG = (function () {
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', 32);
        svg.setAttribute('height', 32);
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M 12,12 L 22,22 M 22,12 12,22');
        path.setAttribute('stroke', '#fff');
        svg.appendChild(path);
        return svg;
    })();

    var close = new UI.Element(buttonSVG);
    close.setPosition('absolute');
    close.setTop('3px');
    close.setRight('1px');
    close.setCursor('pointer');
    close.onClick(function () {
        if (confirm('Save the emotion command?')) {
            editor.emotionCMDManager.save(editor.emotionCMDManager.current_emotion_cmd);
            let info = editor.emotionCMDManager.current_emotion_cmd.getInfo();
            editor.signals.saveEmotionCMD.dispatch( info );
        } else {
            // Do nothing!
        }
        container.setDisplay('none');
    });
    header.add(close);

    // create canvas
    CreateNECanvas(editor);

    // menu

    let menu = new UI.UList();
    menu.setBackgroundColor('rgba(100, 100, 100, 0.8)');
    menu.dom.style.borderRadius = '10px';
    menu.setWidth('600px');
    menu.setId('menu');
    menu.addClass('nav');
    menu.addClass('nav-pills');

    menu.setPosition('absolute');
    menu.setTop('0px');
    menu.setLeft('200px');
    container.add(menu);

    let buttonTrigger = menu.addLi('Trigger');
    buttonTrigger.classList.add('nav-item');
    buttonTrigger.style.margin = '20px';
    buttonTrigger.style.fontSize = '20px';

    let Event = menu.addLi('Event', 'nav-item dropdown', 'nav-link dropdown-toggle');
    Event.firstChild.setAttribute('data-toggle', 'dropdown');
    Event.style.margin = '12px';
    Event.style.fontSize = '20px';

    let Logic = menu.addLi('Logic', 'nav-item dropdown', 'nav-link dropdown-toggle');
    Logic.firstChild.setAttribute('data-toggle', 'dropdown');
    Logic.style.margin = '12px';
    Logic.style.fontSize = '20px';

    let Action = menu.addLi('Action', 'nav-item dropdown', 'nav-link dropdown-toggle');
    Action.firstChild.setAttribute('data-toggle', 'dropdown');
    Action.style.margin = '12px';
    Action.style.fontSize = '20px';

    let Tool = menu.addLi('Tool', 'nav-item dropdown', 'nav-link dropdown-toggle active');
    Tool.firstChild.setAttribute('data-toggle', 'dropdown');
    Tool.style.margin = '12px';
    Tool.style.fontSize = '20px';

    let menuEvent = new UI.UList();
    menuEvent.addClass('dropdown-menu');
    let buttonTimer = menuEvent.addLi('Timer');
    buttonTimer.classList.add('dropdown-item');
    // let buttonSelect = menuEvent.addLi( 'Select' );
    // buttonSelect.classList.add( 'dropdown-item' );
    Event.appendChild(menuEvent.dom);

    let menuLogic = new UI.UList();
    menuLogic.addClass('dropdown-menu');
    let buttonSequence = menuLogic.addLi('Sequence');
    buttonSequence.classList.add('dropdown-item');
    let buttonSelect = menuLogic.addLi('Select');
    buttonSelect.classList.add('dropdown-item');
    Logic.appendChild(menuLogic.dom);

    let menuAction = new UI.UList();
    menuAction.addClass('dropdown-menu');
    let buttonFace = menuAction.addLi('Face');
    buttonFace.classList.add('dropdown-item');
    // let buttonVibration = menuAction.addLi( 'Vibration' );
    // buttonVibration.classList.add( 'dropdown-item' );
    // let buttonSound = menuAction.addLi( 'Sound' );
    // buttonSound.classList.add( 'dropdown-item' );
    // let buttonDanmaku = menuAction.addLi( 'Danmaku [Text]' );
    // buttonDanmaku.classList.add( 'dropdown-item' );
    // let buttonExplode = menuAction.addLi( 'Particle [Background]' );
    // buttonExplode.classList.add( 'dropdown-item' );
    Action.appendChild(menuAction.dom);

    let menuTool = new UI.UList();
    menuTool.addClass('dropdown-menu');
    let cmdNew = menuTool.addLi('New');
    cmdNew.classList.add('dropdown-item');
    let cmdSave = menuTool.addLi('Save');
    cmdSave.classList.add('dropdown-item');
    let cmdClean = menuTool.addLi('Clean');
    cmdClean.classList.add('dropdown-item');
    let cmdImport = menuTool.addLi('Import');
    cmdImport.classList.add('dropdown-item');
    let cmdExport = menuTool.addLi('Export');
    cmdExport.classList.add('dropdown-item');
    Tool.appendChild(menuTool.dom);

    $(function () {
        ResizeNECanvas(editor);

        editor.emotionCMDManager.current_emotion_cmd = new EmotionCMD();
        editor.emotionCMDManager.emotion_canvas = new LGraphCanvas("#editor_canvas", editor.emotionCMDManager.current_emotion_cmd.getGraph());
        editor.emotionCMDManager.current_emotion_cmd.start();

        $(buttonTrigger).click(function () {
            let node = LiteGraph.createNode("node_editor/trigger");
            node.setEditor(editor);
            node.pos = [200, 200];
            editor.emotionCMDManager.current_emotion_cmd.add(node);
        });

        // event

        $( buttonSequence ).click( function () {
            let node = LiteGraph.createNode("logic/sequence");
            node.color = "#800080";
            node.shape = LiteGraph.ROUND_SHAPE;
            node.pos = [200, 200];
            editor.emotionCMDManager.current_emotion_cmd.add(node);
        } );
        $( buttonSelect ).click( function () {
            let node = LiteGraph.createNode("logic/selector");
            node.color = "#800080";
            node.shape = LiteGraph.ROUND_SHAPE;
            node.pos = [200, 200];
            editor.emotionCMDManager.current_emotion_cmd.add(node);
        } );

        //

        $(buttonFace).click(function () {
            let node = LiteGraph.createNode("node_editor/face");
            node.pos = [200, 200];
            editor.emotionCMDManager.current_emotion_cmd.add(node);
        });
        //
        // $( buttonExplode ).click( function () {
        //     emotionCMDManager.addNode( 'particle' );
        // } );
        //
        // $( buttonDanmaku ).click( function () {
        //     emotionCMDManager.addNode( 'danmaku' );
        // } );
        //
        // $( buttonVibration ).click( function () {
        //     emotionCMDManager.addNode( 'viberation' );
        // } );
        //
        // $( buttonSound ).click( function (  ) {
        //     emotionCMDManager.addNode( 'sound' );
        // } );

        //
        $(cmdNew).click(function () {
            $('#editor_canvas').remove();
            CreateNECanvas(editor);
            ResizeNECanvas(editor);

            editor.emotionCMDManager.current_emotion_cmd = new EmotionCMD();
            editor.emotionCMDManager.emotion_canvas = new LGraphCanvas("#editor_canvas", editor.emotionCMDManager.current_emotion_cmd.getGraph());
            editor.emotionCMDManager.current_emotion_cmd.start();
        });

        $(cmdSave).click(function () {
            editor.emotionCMDManager.save(editor.emotionCMDManager.current_emotion_cmd);
            let info = editor.emotionCMDManager.current_emotion_cmd.getInfo();
            editor.signals.saveEmotionCMD.dispatch( info );
        });

        $(cmdClean).click(function () {
            $('#editor_canvas').remove();
            CreateNECanvas(editor);
            ResizeNECanvas(editor);

            editor.emotionCMDManager.current_emotion_cmd = new EmotionCMD();
            editor.emotionCMDManager.emotion_canvas = new LGraphCanvas("#editor_canvas", editor.emotionCMDManager.current_emotion_cmd.getGraph());
            editor.emotionCMDManager.current_emotion_cmd.start();
        });

        let form = document.createElement('form');
        form.style.display = 'none';
        document.body.appendChild(form);

        //

        let fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.addEventListener('change', function (event) {

            let file = fileInput.files[0];

            let reader = new FileReader();

            reader.addEventListener('load', function (event) {
                let contents = event.target.result;

                let jsonFile = JSON.parse(contents);

                editor.emotionCMDManager.fromJSON( jsonFile );

                for ( let prop in editor.emotionCMDManager.all_emotion_cmds) {

                    let info = editor.emotionCMDManager.all_emotion_cmds[ prop ].getInfo();
                    editor.signals.saveEmotionCMD.dispatch( info );
                }
            });
            reader.readAsText(file);
            form.reset();

        });
        form.appendChild(fileInput);

        //

        $(cmdImport).click(function () {
            fileInput.click();
        });

        $(cmdExport).click(function () {
            editor.emotionCMDManager.save(editor.emotionCMDManager.current_emotion_cmd);
            let text_file = JSON.stringify(editor.emotionCMDManager);

            function download(text, name, type) {
                let a = document.createElement("a");
                let file = new Blob([text], {type: type});
                a.href = URL.createObjectURL(file);
                a.download = name;
                a.click();
            }

            download(text_file, 'test.json', 'text/plain');
        });
    });


    // Keyboard trigger

    // editor.signals.editorCleared.add(function () {
    //     container.setDisplay('none');
    // });
    //
    // editor.signals.editEmotionCMD.add(function () {
    //     container.setDisplay('');
    // });

    return container;
};
