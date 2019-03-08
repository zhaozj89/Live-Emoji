"use strict";

function _ComputeEmotionCMDMatchScore() {
    return 0;
}

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
    });
    header.add(close);

    // create canvas
    CreateNECanvas(editor);

    // menu

    let menu = new UI.UList();
    menu.setBackgroundColor('rgba(50, 50, 50, 0.8)');
    menu.dom.style.borderRadius = '10px';
    menu.setWidth('800px');
    menu.setId('menu');
    menu.addClass('nav');
    menu.addClass('nav-pills');

    menu.setPosition('absolute');
    menu.setTop('0px');
    menu.setLeft('80px');
    container.add(menu);

    let Event = menu.addLi('Trigger', 'nav-item dropdown', 'nav-link dropdown-toggle');
    Event.firstChild.setAttribute('data-toggle', 'dropdown');
    Event.style.backgroundColor = '#ff0300';
    Event.style.margin = '12px';
    Event.style.fontSize = '14px';

    let Logic = menu.addLi('Logic', 'nav-item dropdown', 'nav-link dropdown-toggle');
    Logic.firstChild.setAttribute('data-toggle', 'dropdown');
    Logic.style.backgroundColor = '#31baff';
    Logic.style.margin = '12px';
    Logic.style.fontSize = '14px';

    let Face = menu.addLi('Face', 'nav-item dropdown', 'nav-link dropdown-toggle');
    Face.firstChild.setAttribute('data-toggle', 'dropdown');
    Face.style.backgroundColor = '#ffb032';
    Face.style.margin = '12px';
    Face.style.fontSize = '14px';

    let Particle = menu.addLi('Particle', 'nav-item dropdown', 'nav-link dropdown-toggle');
    Particle.firstChild.setAttribute('data-toggle', 'dropdown');
    Particle.style.backgroundColor = '#ae0cff';
    Particle.style.margin = '12px';
    Particle.style.fontSize = '14px';

    let Danmaku = menu.addLi('Danmaku', 'nav-item dropdown', 'nav-link dropdown-toggle');
    Danmaku.firstChild.setAttribute('data-toggle', 'dropdown');
    Danmaku.style.backgroundColor = '#39a971';
    Danmaku.style.margin = '12px';
    Danmaku.style.fontSize = '14px';

    let Music = menu.addLi('Music', 'nav-item dropdown', 'nav-link dropdown-toggle');
    Music.firstChild.setAttribute('data-toggle', 'dropdown');
    Music.style.backgroundColor = '#a95166';
    Music.style.margin = '12px';
    Music.style.fontSize = '14px';

    let Scene = menu.addLi('Scene', 'nav-item dropdown', 'nav-link dropdown-toggle');
    Scene.firstChild.setAttribute('data-toggle', 'dropdown');
    Scene.style.backgroundColor = '#ff13a3';
    Scene.style.margin = '12px';
    Scene.style.fontSize = '14px';

    let menuEvent = new UI.UList();
    menuEvent.addClass('dropdown-menu');
    let buttonKeyboard1 = menuEvent.addLi('a-z');
    buttonKeyboard1.classList.add('dropdown-item');
    let buttonKeyboard2 = menuEvent.addLi('A-Z');
    buttonKeyboard2.classList.add('dropdown-item');
    let buttonMouse = menuEvent.addLi('Mouse');
    buttonMouse.classList.add('dropdown-item');
    let buttonCounter = menuEvent.addLi('Counter');
    buttonCounter.classList.add('dropdown-item');
    let buttonEmotion = menuEvent.addLi('Emotion');
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
    Face.appendChild(menuFace.dom);

    let menuParticle = new UI.UList();
    menuParticle.addClass('dropdown-menu');
    let buttonFountain = menuParticle.addLi( 'Fountain' );
    buttonFountain.classList.add( 'dropdown-item' );
    let buttonIllusion = menuParticle.addLi( 'Illusion' );
    buttonIllusion.classList.add( 'dropdown-item' );
    let buttonFire = menuParticle.addLi( 'Fire' );
    buttonFire.classList.add( 'dropdown-item' );
    let buttonSnow = menuParticle.addLi( 'Snow' );
    buttonSnow.classList.add( 'dropdown-item' );
    Particle.appendChild(menuParticle.dom);

    let menuDanmaku = new UI.UList();
    menuDanmaku.addClass('dropdown-menu');
    let buttonDanmaku = menuDanmaku.addLi( 'Danmaku' );
    buttonDanmaku.classList.add( 'dropdown-item' );
    Danmaku.appendChild(menuDanmaku.dom);

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

        // Particle

        $( buttonFountain ).click( function () {
            let node = LiteGraph.createNode("node_editor/fountain");
            node.pos = _GetRandomPositionArray();
            editor.emotionCMDManager.current_emotion_cmd.add(node);
        } );

        $( buttonIllusion ).click( function () {
            let node = LiteGraph.createNode("node_editor/illusion");
            node.pos = _GetRandomPositionArray();
            editor.emotionCMDManager.current_emotion_cmd.add(node);
        } );

        $( buttonFire ).click( function () {
            let node = LiteGraph.createNode("node_editor/fire");
            node.pos = _GetRandomPositionArray();
            editor.emotionCMDManager.current_emotion_cmd.add(node);
        } );

        $( buttonSnow ).click( function () {
            let node = LiteGraph.createNode("node_editor/snow");
            node.pos = _GetRandomPositionArray();
            editor.emotionCMDManager.current_emotion_cmd.add(node);
        } );

        //
        $(buttonDanmaku).click( function () {
            let node = LiteGraph.createNode("node_editor/danmaku");
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
    });

    return container;
};
