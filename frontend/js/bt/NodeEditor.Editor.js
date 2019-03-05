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
            let info = editor.emotionCMDManager.save(editor.emotionCMDManager.current_emotion_cmd);
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
    menu.setBackgroundColor('rgba(50, 50, 50, 0.8)');
    menu.dom.style.borderRadius = '10px';
    menu.setWidth('700px');
    menu.setId('menu');
    menu.addClass('nav');
    menu.addClass('nav-pills');

    menu.setPosition('absolute');
    menu.setTop('0px');
    menu.setLeft('200px');
    container.add(menu);

    let Event = menu.addLi('Event', 'nav-item dropdown', 'nav-link dropdown-toggle');
    Event.firstChild.setAttribute('data-toggle', 'dropdown');
    Event.style.backgroundColor = '#ff0300';
    Event.style.margin = '12px';
    Event.style.fontSize = '20px';

    let Logic = menu.addLi('Logic', 'nav-item dropdown', 'nav-link dropdown-toggle');
    Logic.firstChild.setAttribute('data-toggle', 'dropdown');
    Logic.style.backgroundColor = '#31baff';
    Logic.style.margin = '12px';
    Logic.style.fontSize = '20px';

    let Face = menu.addLi('Face', 'nav-item dropdown', 'nav-link dropdown-toggle');
    Face.firstChild.setAttribute('data-toggle', 'dropdown');
    Face.style.backgroundColor = '#ffb032';
    Face.style.margin = '12px';
    Face.style.fontSize = '20px';

    let Particle = menu.addLi('Particle', 'nav-item dropdown', 'nav-link dropdown-toggle');
    Particle.firstChild.setAttribute('data-toggle', 'dropdown');
    Particle.style.backgroundColor = '#ae0cff';
    Particle.style.margin = '12px';
    Particle.style.fontSize = '20px';

    let Tool = menu.addLi('Tool', 'nav-item dropdown', 'nav-link dropdown-toggle');
    Tool.firstChild.setAttribute('data-toggle', 'dropdown');
    Tool.style.backgroundColor = '#0065ff';
    Tool.style.margin = '12px';
    Tool.style.fontSize = '20px';

    let menuEvent = new UI.UList();
    menuEvent.addClass('dropdown-menu');
    let buttonKeyboard = menuEvent.addLi('Keyboard');
    buttonKeyboard.classList.add('dropdown-item');
    // let buttonTimer = menuEvent.addLi('Timer');
    // buttonTimer.classList.add('dropdown-item');
    Event.appendChild(menuEvent.dom);

    let menuLogic = new UI.UList();
    menuLogic.addClass('dropdown-menu');
    let buttonAnd = menuLogic.addLi('And');
    buttonAnd.classList.add('dropdown-item');
    let buttonOr = menuLogic.addLi('Or');
    buttonOr.classList.add('dropdown-item');
    Logic.appendChild(menuLogic.dom);

    let menuFace = new UI.UList();
    menuFace.addClass('dropdown-menu');
    let buttonFaceEmotion = menuFace.addLi('Emotion');
    buttonFaceEmotion.classList.add('dropdown-item');
    Face.appendChild(menuFace.dom);

    let menuParticle = new UI.UList();
    menuParticle.addClass('dropdown-menu');
    let buttonFountain = menuParticle.addLi( 'Fountain' );
    buttonFountain.classList.add( 'dropdown-item' );
    Particle.appendChild(menuParticle.dom);

    let menuTool = new UI.UList();
    menuTool.addClass('dropdown-menu');
    let cmdNew = menuTool.addLi('New');
    cmdNew.classList.add('dropdown-item');
    let cmdSave = menuTool.addLi('Save');
    cmdSave.classList.add('dropdown-item');
    let cmdClean = menuTool.addLi('Clean');
    cmdClean.classList.add('dropdown-item');
    // let cmdImport = menuTool.addLi('Import');
    // cmdImport.classList.add('dropdown-item');
    let cmdExport = menuTool.addLi('Export');
    cmdExport.classList.add('dropdown-item');
    Tool.appendChild(menuTool.dom);

    $(function () {
        ResizeNECanvas(editor);

        editor.emotionCMDManager.current_emotion_cmd = new EmotionCMD();
        editor.emotionCMDManager.emotion_canvas = new LGraphCanvas("#editor_canvas", editor.emotionCMDManager.current_emotion_cmd.getGraph());

        //event
        $(buttonKeyboard).click(function () {
            let node = LiteGraph.createNode("node_editor/keyboard");
            node.pos = [200, 200];
            editor.emotionCMDManager.current_emotion_cmd.add(node);
        });

        // logic

        $( buttonAnd ).click( function () {
            let node = LiteGraph.createNode("node_editor/and");
            node.pos = [200, 200];
            editor.emotionCMDManager.current_emotion_cmd.add(node);
        } );
        $( buttonOr ).click( function () {
            let node = LiteGraph.createNode("node_editor/or");
            node.pos = [200, 200];
            editor.emotionCMDManager.current_emotion_cmd.add(node);
        } );

        // Face

        $(buttonFaceEmotion).click(function () {
            let node = LiteGraph.createNode("node_editor/face_emotion");
            node.pos = [200, 200];
            editor.emotionCMDManager.current_emotion_cmd.add(node);
        });

        $( buttonFountain ).click( function () {
            let node = LiteGraph.createNode("node_editor/fountain");
            node.pos = [200, 200];
            editor.emotionCMDManager.current_emotion_cmd.add(node);
        } );

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
        });

        $(cmdSave).click(function () {
            let info = editor.emotionCMDManager.save(editor.emotionCMDManager.current_emotion_cmd);
            editor.signals.saveEmotionCMD.dispatch( info );
        });

        $(cmdClean).click(function () {
            $('#editor_canvas').remove();
            CreateNECanvas(editor);
            ResizeNECanvas(editor);

            editor.emotionCMDManager.current_emotion_cmd = new EmotionCMD();
            editor.emotionCMDManager.emotion_canvas = new LGraphCanvas("#editor_canvas", editor.emotionCMDManager.current_emotion_cmd.getGraph());
        });

        let form = document.createElement('form');
        form.style.display = 'none';
        document.body.appendChild(form);

        // //
        //
        // let fileInput = document.createElement('input');
        // fileInput.type = 'file';
        // fileInput.addEventListener('change', function (event) {
        //
        //     let file = fileInput.files[0];
        //
        //     let reader = new FileReader();
        //
        //     reader.addEventListener('load', function (event) {
        //         let contents = event.target.result;
        //
        //         let jsonFile = JSON.parse(contents);
        //
        //         editor.emotionCMDManager.fromJSON( jsonFile );
        //
        //         for ( let prop in editor.emotionCMDManager.all_emotion_cmds) {
        //
        //             let info = editor.emotionCMDManager.all_emotion_cmds[ prop ].getInfo();
        //             editor.signals.saveEmotionCMD.dispatch( info );
        //         }
        //     });
        //     reader.readAsText(file);
        //     form.reset();
        //
        // });
        // form.appendChild(fileInput);
        //
        // //
        //
        // $(cmdImport).click(function () {
        //     fileInput.click();
        // });

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

    return container;
};
