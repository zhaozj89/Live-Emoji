var SidebarLeft = function (editor) {

    let container = new UI.Panel();
    container.setId('sidebar');
    container.dom.style.zIndex = '4';

    let titleView = new UI.Text('Audience View');
    titleView.addClass('h4');
    titleView.setTextAlign('center');
    titleView.setColor('whitesmoke');
    titleView.setWidth('300px');
    titleView.setBackgroundColor('blueviolet');
    container.add(titleView);

    let audience_view = new AudienceView(editor);
    container.add(audience_view);

    let renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.vr.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(editor.side_view.dom.offsetWidth, editor.side_view.dom.offsetHeight);
    editor.side_view.dom.appendChild(WEBVR.createButton(renderer, {frameOfReferenceType: 'head-model'}));
    editor.side_view.dom.appendChild(renderer.domElement);

    editor.side_view_renderer = renderer;

    // choose mode
    // let modeButtons = new UI.Div();
    // modeButtons.setMargin('5px');
    // modeButtons.addClass('btn-group');
    // modeButtons.addClass('btn-group-toggle');
    // modeButtons.dom.setAttribute('data-toggle', 'buttons');
    // container.add(modeButtons);
    //
    // let liveLabel = new UI.Label();
    // liveLabel.addClass('btn');
    // liveLabel.addClass('btn-secondary');
    // liveLabel.setWidth('140px');
    // modeButtons.add(liveLabel);
    // liveLabel.dom.innerHTML = 'Live';
    //
    // let liveInput = new UI.Input('');
    // liveInput.dom.setAttribute('type', 'radio');
    // liveInput.dom.setAttribute('name', 'options');
    // liveInput.dom.setAttribute('autocomplete', 'off');
    // liveLabel.add(liveInput);
    //
    // let editLabel = new UI.Label();
    // editLabel.addClass('btn');
    // editLabel.addClass('btn-secondary');
    // editLabel.setWidth('150px');
    // modeButtons.add(editLabel);
    // editLabel.dom.innerHTML = 'Edit';
    //
    // let editInput = new UI.Input('');
    // editInput.dom.setAttribute('type', 'radio');
    // editInput.dom.setAttribute('name', 'options');
    // editInput.dom.setAttribute('autocomplete', 'off');
    // editLabel.add(editInput);
    //
    // liveLabel.dom.onclick = function () {
    //     liveLabel.addClass('active');
    //     editLabel.removeClass('active');
    //
    //     liveLabel.setOpacity('1');
    //     editLabel.setOpacity('0.2');
    //
    //     editor.emotionCMDManager.start();
    // }
    //
    // editLabel.dom.onclick = function () {
    //     liveLabel.removeClass('active');
    //     editLabel.addClass('active');
    //
    //     liveLabel.setOpacity('0.2');
    //     editLabel.setOpacity('1');
    //
    //     editor.emotionCMDManager.stop();
    //     if (editor.emotionCMDManager.current_emotion_cmd != null)
    //         editor.emotionCMDManager.current_emotion_cmd.start();
    // }
    //
    // liveLabel.setOpacity('0.2');
    // editLabel.setOpacity('0.2');
    //
    // $(editLabel.dom).click();

    //

    let titleEmotionCommand = new UI.Text('Stories');
    titleEmotionCommand.addClass('h4');
    titleEmotionCommand.setTextAlign('center');
    titleEmotionCommand.setColor('whitesmoke');
    titleEmotionCommand.setMarginTop('15px');
    titleEmotionCommand.setWidth('300px');
    titleEmotionCommand.setBackgroundColor('blueviolet');
    container.add(titleEmotionCommand);

    let emotionCommandView = new SidebarLeft.EmotionCMD(editor);
    container.add(emotionCommandView);

    return container;

};
