"use strict";

function _GetRandomPositionArray() {
    return [300+Math.random()*100, 300+Math.random()*100];
}

var NodeEditor = function (editor) {
    let container = new UI.Panel();
    container.setId('NodeEditor');
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
            SaveAEmotionCMD(editor.emotionCMDManager.current_emotion_cmd);
        }
        container.setDisplay('none');
        editor.script_editor.setDisplay('');
        editor.script_editor.dom.style.zIndex = "0";
    });
    header.add(close);

    // create canvas
    CreateNECanvas(editor);

    // menu

    let menu = new UI.UList();
    menu.setBackgroundColor('rgba(50, 50, 50, 0.8)');
    menu.dom.style.borderRadius = '20px';
    menu.setWidth('893px');
    menu.setId('menu');
    menu.addClass('nav');
    menu.addClass('nav-pills');

    menu.setPosition('absolute');
    menu.setTop('0px');
    menu.setLeft('120px');
    container.add(menu);

    let Event = menu.addLi('Trigger', 'nav-item dropdown', 'nav-link dropdown-toggle');
    Event.firstChild.setAttribute('data-toggle', 'dropdown');
    Event.style.backgroundColor = '#cb181d';
    Event.style.margin = '12px';
    Event.style.fontSize = '20px';

    let Logic = menu.addLi('Logic', 'nav-item dropdown', 'nav-link dropdown-toggle');
    Logic.firstChild.setAttribute('data-toggle', 'dropdown');
    Logic.style.backgroundColor = '#238745';
    Logic.style.margin = '12px';
    Logic.style.fontSize = '20px';

    let Face = menu.addLi('Avatar', 'nav-item dropdown', 'nav-link dropdown-toggle');
    Face.firstChild.setAttribute('data-toggle', 'dropdown');
    Face.style.backgroundColor = '#253494';
    Face.style.margin = '12px';
    Face.style.fontSize = '20px';

    let Particle = menu.addLi('Texture', 'nav-item dropdown', 'nav-link dropdown-toggle');
    Particle.firstChild.setAttribute('data-toggle', 'dropdown');
    Particle.style.backgroundColor = '#2c7fb8';
    Particle.style.margin = '12px';
    Particle.style.fontSize = '20px';

    let Danmaku = menu.addLi('Text', 'nav-item dropdown', 'nav-link dropdown-toggle');
    Danmaku.firstChild.setAttribute('data-toggle', 'dropdown');
    Danmaku.style.backgroundColor = '#41b6c4';
    Danmaku.style.margin = '12px';
    Danmaku.style.fontSize = '20px';

    let Sound = menu.addLi('Sound', 'nav-item dropdown', 'nav-link dropdown-toggle');
    Sound.firstChild.setAttribute('data-toggle', 'dropdown');
    Sound.style.backgroundColor = '#7fcdbb';
    Sound.style.margin = '12px';
    Sound.style.fontSize = '20px';

    let Scene = menu.addLi('Scene', 'nav-item dropdown', 'nav-link dropdown-toggle');
    Scene.firstChild.setAttribute('data-toggle', 'dropdown');
    Scene.style.backgroundColor = '#88419d';
    Scene.style.margin = '12px';
    Scene.style.fontSize = '20px';

    let menuEvent = new UI.UList();
    menuEvent.addClass('dropdown-menu');
    let buttonKeyboardNumber = menuEvent.addLi('Keyboard (0-9)');
    buttonKeyboardNumber.classList.add('dropdown-item');
    let buttonKeyboard1 = menuEvent.addLi('Keyboard (a-z)');
    buttonKeyboard1.classList.add('dropdown-item');
    let buttonKeyboard2 = menuEvent.addLi('Keyboard (A-Z)');
    buttonKeyboard2.classList.add('dropdown-item');
    let buttonMouse = menuEvent.addLi('Mouse');
    buttonMouse.classList.add('dropdown-item');
    let buttonCounter = menuEvent.addLi('Counter');
    buttonCounter.classList.add('dropdown-item');
    let buttonEmotion = menuEvent.addLi('Facial Expression');
    buttonEmotion.classList.add('dropdown-item');
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
    let buttonFacePosition = menuFace.addLi('Position');
    buttonFacePosition.classList.add('dropdown-item');
    let buttonFaceRole = menuFace.addLi('Role');
    buttonFaceRole.classList.add('dropdown-item');
    let buttonFaceReset = menuFace.addLi('Reset');
    buttonFaceReset.classList.add('dropdown-item');
    Face.appendChild(menuFace.dom);

    let menuParticle = new UI.UList();
    menuParticle.addClass('dropdown-menu');
    let buttonAnchor = menuParticle.addLi( 'Anchor' );
    buttonAnchor.classList.add( 'dropdown-item' );
    let buttonOverwhelm = menuParticle.addLi( 'Overwhelm' );
    buttonOverwhelm.classList.add( 'dropdown-item' );
    let buttonAttraction = menuParticle.addLi( 'Attraction' );
    buttonAttraction.classList.add( 'dropdown-item' );
    Particle.appendChild(menuParticle.dom);

    let menuDanmaku = new UI.UList();
    menuDanmaku.addClass('dropdown-menu');
    let buttonDanmaku = menuDanmaku.addLi( 'Text' );
    buttonDanmaku.classList.add( 'dropdown-item' );
    Danmaku.appendChild(menuDanmaku.dom);

    let menuSound = new UI.UList();
    menuSound.addClass('dropdown-menu');
    let buttonSound = menuSound.addLi( 'Sound' );
    buttonSound.classList.add( 'dropdown-item' );
    let buttonEmotionSound = menuSound.addLi( 'Emotion Sound' );
    buttonEmotionSound.classList.add( 'dropdown-item' );
    Sound.appendChild(menuSound.dom);

    let menuScene = new UI.UList();
    menuScene.addClass('dropdown-menu');
    let buttonBackground = menuScene.addLi( 'Background' );
    buttonBackground.classList.add( 'dropdown-item' );
    let buttonBackgroundRotation = menuScene.addLi( 'Rotation' );
    buttonBackgroundRotation.classList.add( 'dropdown-item' );
    Scene.appendChild(menuScene.dom);

    $(function () {
        ResizeNECanvas(editor);

        editor.emotionCMDManager.current_emotion_cmd = new EmotionCMD();
        editor.emotionCMDManager.emotion_canvas = new LGraphCanvas("#editor_canvas", editor.emotionCMDManager.current_emotion_cmd.getGraph());
        editor.emotionCMDManager.current_emotion_cmd.start();

        //event
        $(buttonKeyboardNumber).click(function () {
            let node = LiteGraph.createNode("node_editor/keyboard_number");
            node.pos = _GetRandomPositionArray();
            editor.emotionCMDManager.current_emotion_cmd.add(node);
        });

        $(buttonKeyboard1).click(function () {
            let node = LiteGraph.createNode("node_editor/keyboard1");
            node.pos = _GetRandomPositionArray();
            editor.emotionCMDManager.current_emotion_cmd.add(node);
        });

        $(buttonKeyboard2).click(function () {
            let node = LiteGraph.createNode("node_editor/keyboard2");
            node.pos = _GetRandomPositionArray();
            editor.emotionCMDManager.current_emotion_cmd.add(node);
        });

        $(buttonMouse).click(function () {
            let node = LiteGraph.createNode("node_editor/mouse");
            node.pos = _GetRandomPositionArray();
            editor.emotionCMDManager.current_emotion_cmd.add(node);
        });

        $(buttonCounter).click(function () {
            let node = LiteGraph.createNode("node_editor/counter");
            node.pos = _GetRandomPositionArray();
            editor.emotionCMDManager.current_emotion_cmd.add(node);
        });

        $(buttonEmotion).click(function () {
            let node = LiteGraph.createNode("node_editor/emotion_trigger");
            node.pos = _GetRandomPositionArray();
            editor.emotionCMDManager.current_emotion_cmd.add(node);
        });

        // logic

        $( buttonAnd ).click( function () {
            let node = LiteGraph.createNode("node_editor/and");
            node.pos = _GetRandomPositionArray();
            editor.emotionCMDManager.current_emotion_cmd.add(node);
        } );
        $( buttonOr ).click( function () {
            let node = LiteGraph.createNode("node_editor/or");
            node.pos = _GetRandomPositionArray();
            editor.emotionCMDManager.current_emotion_cmd.add(node);
        } );

        // Face

        $(buttonFaceEmotion).click(function () {
            let node = LiteGraph.createNode("node_editor/face_emotion");
            node.pos = _GetRandomPositionArray();
            editor.emotionCMDManager.current_emotion_cmd.add(node);
        });

        $(buttonFacePosition).click(function () {
            let node = LiteGraph.createNode("node_editor/face_position");
            node.pos = _GetRandomPositionArray();
            editor.emotionCMDManager.current_emotion_cmd.add(node);
        });

        $(buttonFaceRole).click(function () {
            let node = LiteGraph.createNode("node_editor/face_role");
            node.pos = _GetRandomPositionArray();
            editor.emotionCMDManager.current_emotion_cmd.add(node);
        });

        $(buttonFaceReset).click(function () {
            let node = LiteGraph.createNode("node_editor/face_reset");
            node.pos = _GetRandomPositionArray();
            editor.emotionCMDManager.current_emotion_cmd.add(node);
        });

        // Particle

        $( buttonAnchor ).click( function () {
            let node = LiteGraph.createNode("node_editor/anchor");
            node.pos = _GetRandomPositionArray();
            editor.emotionCMDManager.current_emotion_cmd.add(node);
        } );

        $( buttonOverwhelm ).click( function () {
            let node = LiteGraph.createNode("node_editor/overwhelm");
            node.pos = _GetRandomPositionArray();
            editor.emotionCMDManager.current_emotion_cmd.add(node);
        } );

        $( buttonAttraction ).click( function () {
            let node = LiteGraph.createNode("node_editor/attraction");
            node.pos = _GetRandomPositionArray();
            editor.emotionCMDManager.current_emotion_cmd.add(node);
        } );

        // scene
        $(buttonBackground).click(function () {
            let node = LiteGraph.createNode("node_editor/background");
            node.pos = _GetRandomPositionArray();
            editor.emotionCMDManager.current_emotion_cmd.add(node);
        });

        $(buttonBackgroundRotation).click(function () {
            let node = LiteGraph.createNode("node_editor/background_rotation");
            node.pos = _GetRandomPositionArray();
            editor.emotionCMDManager.current_emotion_cmd.add(node);
        });

        //
        $(buttonDanmaku).click( function () {
            let node = LiteGraph.createNode("node_editor/danmaku");
            node.pos = _GetRandomPositionArray();
            editor.emotionCMDManager.current_emotion_cmd.add(node);
        } );

        //
        $(buttonSound).click( function () {
            let node = LiteGraph.createNode("node_editor/sound");
            node.pos = _GetRandomPositionArray();
            editor.emotionCMDManager.current_emotion_cmd.add(node);
        } );

        $(buttonEmotionSound).click( function () {
            let node = LiteGraph.createNode("node_editor/emotion_sound");
            node.pos = _GetRandomPositionArray();
            editor.emotionCMDManager.current_emotion_cmd.add(node);
        } );
    });

    return container;
};
