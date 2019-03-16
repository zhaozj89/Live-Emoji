var SidebarLeft = function (editor) {

    let container = new UI.Panel();
    container.setId('sidebar');
    container.dom.style.zIndex = '4';

    let titleView = new UI.Text('Audience View');
    titleView.addClass('h4');
    titleView.setTextAlign('center');
    titleView.setColor('whitesmoke');
    titleView.setWidth('300px');
    // titleView.setBackgroundColor('blueviolet');
    titleView.setBackgroundColor('#2185b5');
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

    let titleOverhead = new UI.Text('Overhead');
    titleOverhead.addClass('h4');
    titleOverhead.setTextAlign('center');
    titleOverhead.setColor('whitesmoke');
    titleOverhead.setWidth('300px');
    // titleView.setBackgroundColor('blueviolet');
    titleOverhead.setBackgroundColor('#2185b5');
    container.add(titleOverhead);

    let overhead_canvas = new UI.Canvas();
    overhead_canvas.setWidth("300px");
    overhead_canvas.setHeight("300px");
    overhead_canvas.dom.width = 300;
    overhead_canvas.dom.height = 300;

    let mainContext = overhead_canvas.dom.getContext('2d');
    let canvasWidth = overhead_canvas.dom.width;
    let canvasHeight = overhead_canvas.dom.height;

    let pre_main_arrow1 = new THREE.Vector2(-50, -50);
    let pre_main_arrow2 = new THREE.Vector2(50, -50);

    let delta_theta = 0;

    function _RotateTheta(vec, theta) {
        let res = new THREE.Vector2(0, 0);

        let cost = Math.cos(theta);
        let sint = Math.sin(theta);

        res.x = vec.x*cost-vec.y*sint;
        res.y = vec.x*sint+vec.y*cost;
        return res;
    }
    
    function _RedrawOverhead(delta_theta) {
        //background
        mainContext.beginPath();
        mainContext.arc(150, 150, 150, 0, 2 * Math.PI, true);
        mainContext.fillStyle = "#ffffff";
        mainContext.fill();
        mainContext.closePath();

        mainContext.strokeStyle = "#000000";
        mainContext.setLineDash([5, 3]);
        mainContext.lineWidth = 1;

        mainContext.beginPath();
        mainContext.moveTo(0,150);
        mainContext.lineTo(300, 150);
        mainContext.stroke();
        mainContext.closePath();

        mainContext.beginPath();
        mainContext.moveTo(150,0);
        mainContext.lineTo(150, 300);
        mainContext.stroke();
        mainContext.closePath();

        // rotate
        pre_main_arrow1 = _RotateTheta(pre_main_arrow1, delta_theta);
        pre_main_arrow2 = _RotateTheta(pre_main_arrow2, delta_theta);

        mainContext.strokeStyle = "#ff0000";
        mainContext.setLineDash([0]);
        mainContext.lineWidth = 3;

        mainContext.beginPath();
        mainContext.moveTo(150, 150);
        mainContext.lineTo(150+pre_main_arrow1.x, 150+pre_main_arrow1.y);
        mainContext.stroke();

        mainContext.moveTo(150, 150);
        mainContext.lineTo(150+pre_main_arrow2.x, 150+pre_main_arrow2.y);
        mainContext.stroke();
        mainContext.closePath();

        let side_angle = -editor.side_camera.rotation.y;
        mainContext.beginPath();
        mainContext.moveTo(150,150);
        mainContext.arc(150,150,60,-3*Math.PI/4+side_angle,-Math.PI/4+side_angle);
        mainContext.fillStyle = "rgba(100,0,0,0.5)";
        mainContext.fill();
        mainContext.closePath();

    }

    _RedrawOverhead(delta_theta);

    editor.signals.main_camera_rotate_y.add(function (delta) {
        delta_theta = delta;
        _RedrawOverhead(delta_theta);
    });

    editor.signals.side_camera_rotate_y.add(function () {
        _RedrawOverhead(delta_theta);
    });

    container.add(overhead_canvas);

    return container;

};
