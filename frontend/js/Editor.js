var Editor = function () {
    this.main_view_renderer = null;
    this.side_view_renderer = null;

    this.main_view = null;
    this.side_view = null;

    this.main_camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100);
    this.main_camera.name = 'main_camera';
    this.side_camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100);
    this.side_camera.name = 'side_camera';

    this.scene = new THREE.Scene();

    // UI components
    this.sidebar = null;
    this.sidebar_right = null;
    this.node_editor = null;
    this.script_editor = null;
    this.node_editor_canvas = null;

    // face tracking and event mutex
    let that = this;
    this.GlobalRunningEmotionCMDState = {
        running: false,
        has_particle_node: false,
        num_danmaku_node: 0
    };
    this.UpdateRunningEmotionCMDState = function () {
        if (that.GlobalRunningEmotionCMDState.has_particle_node === false) {
            that.GlobalRunningEmotionCMDState.running = false;

            if (editor.selected !== null) {
                editor.selected.updateEmotion('neutral');
                editor.signals.sceneGraphChanged.dispatch();
            }
        }
        else{
            that.GlobalRunningEmotionCMDState.running = true;
        }
    }

    let Signal = signals.Signal;
    this.signals = {
        main_camera_rotate_y: new Signal(),
        side_camera_rotate_y: new Signal(),

        // face following
        followFace: new Signal(),
        followLeftEye: new Signal(),
        followRightEye: new Signal(),
        followMouth: new Signal(),
        updateCurrentDetectedEmotionIntensity: new Signal(),

        saveEmotionCMD: new Signal(),
        sceneGraphChanged: new Signal(),

        CharacterAddedToScene: new Signal(),

        geometryChanged: new Signal(),
        objectSelected: new Signal(),
        objectAdded: new Signal(),
        objectChanged: new Signal(),
        objectRemoved: new Signal(),
        helperAdded: new Signal(),
        helperRemoved: new Signal(),
        materialChanged: new Signal(),
        windowResize: new Signal(),
        historyChanged: new Signal()
    };


    ////////////////////////////////////////////////////////////
    this.loader = new Loader(this);

    // Mode
    this.boyLabel = null;
    this.girlLabel = null;
    this.boyLoaded = false;
    this.girlLoaded = false;

    this.boy = null;
    this.girl = null;
    this.selected = null; // character
    this.emotionCMDManager = new EmotionCMDManager(this);
    this.backgroundSprite = null;

    this.quill = null;
    this.current_emotion = null;
    this.danmaku_bmtext = null;
    this.sound_player = null;

    // node editing related
    this.static_background_sphere = null;
    this.staic_background_material = null;
    this.particle_engine_proton = null;
};

Editor.prototype = {};
