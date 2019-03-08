var Editor = function () {
    this.quill = null;
    this.current_emotion = null;

    this.danmaku_bmtext = null;

    // global
    this.GlobalCounter = 0;

    // node editing related
    this.static_background_sphere = null;
    this.staic_background_material = null;
    this.particle_engine_proton = null;

    this.main_view_renderer = null;
    this.side_view_renderer = null;
    this.main_view = null;
    this.side_view = null;
    this.main_camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100);
    this.main_camera.name = 'main_camera';
    this.side_camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100);
    this.side_camera.name = 'side_camera';

    this.scene = new THREE.Scene();

    //config
    this.config = new Config('threejs-editor');
    this.history = new History(this);
    this.loader = new Loader(this);

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

    this.runAtLeastOneCMD = false;


    // Mode
    this.boyLabel = null;
    this.girlLabel = null;
    this.boyLoaded = false;
    this.girlLoaded = false;

    this.soundPlayer = null;

    var Signal = signals.Signal;

    this.signals = {
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

    // objects

    this.boy = null;
    this.girl = null;

    this.selected = null; // character

    this.emotionCMDManager = new EmotionCMDManager(this);

    this.autoArousalLevel = 70;
    this.allArousals = [];

    this.currentEmitter = null;

    this.allParticleNodes = [];

    this.backgroundSprite = null;

    this.top3Keys = {
        key0: null,
        key1: null,
        key2: null
    };

    this.object = {};
    this.geometries = {};
    this.materials = {};
    this.textures = {};

    this.helpers = {};
};

Editor.prototype = {

    setScene: function (scene) {

        this.scene.uuid = scene.uuid;
        this.scene.name = scene.name;

        if (scene.background !== null) this.scene.background = scene.background.clone();
        if (scene.fog !== null) this.scene.fog = scene.fog.clone();

        this.scene.userData = JSON.parse(JSON.stringify(scene.userData));

        // avoid render per object

        this.signals.sceneGraphChanged.active = false;

        while (scene.children.length > 0) {

            this.addObject(scene.children[0]);

        }

        this.signals.sceneGraphChanged.active = true;
        this.signals.sceneGraphChanged.dispatch();

    },

    //

    addObject: function (object) {

        var scope = this;

        object.traverse(function (child) {

            if (child.geometry !== undefined) scope.addGeometry(child.geometry);
            if (child.material !== undefined) scope.addMaterial(child.material);

            scope.addHelper(child);

        });

        this.scene.add(object);

        this.signals.objectAdded.dispatch(object);
        this.signals.sceneGraphChanged.dispatch();

    },

    moveObject: function (object, parent, before) {

        if (parent === undefined) {

            parent = this.scene;

        }

        parent.add(object);

        // sort children array

        if (before !== undefined) {

            var index = parent.children.indexOf(before);
            parent.children.splice(index, 0, object);
            parent.children.pop();

        }

        this.signals.sceneGraphChanged.dispatch();

    },

    nameObject: function (object, name) {

        object.name = name;
        this.signals.sceneGraphChanged.dispatch();

    },

    removeObject: function (object) {

        if (object.parent === null) return; // avoid deleting the camera or scene

        var scope = this;

        object.traverse(function (child) {

            scope.removeHelper(child);

        });

        object.parent.remove(object);

        this.signals.objectRemoved.dispatch(object);
        this.signals.sceneGraphChanged.dispatch();

    },

    addGeometry: function (geometry) {

        this.geometries[geometry.uuid] = geometry;

    },

    setGeometryName: function (geometry, name) {

        geometry.name = name;
        this.signals.sceneGraphChanged.dispatch();

    },

    addMaterial: function (material) {

        this.materials[material.uuid] = material;

    },

    setMaterialName: function (material, name) {

        material.name = name;
        this.signals.sceneGraphChanged.dispatch();

    },

    addTexture: function (texture) {

        this.textures[texture.uuid] = texture;

    },

    //

    addHelper: function () {

        var geometry = new THREE.SphereBufferGeometry(2, 4, 2);
        var material = new THREE.MeshBasicMaterial({color: 0xff0000, visible: false});

        return function (object) {

            var helper;

            if (object instanceof THREE.Camera) {

                helper = new THREE.CameraHelper(object, 1);

            } else if (object instanceof THREE.PointLight) {

                helper = new THREE.PointLightHelper(object, 1);

            } else if (object instanceof THREE.DirectionalLight) {

                helper = new THREE.DirectionalLightHelper(object, 1);

            } else if (object instanceof THREE.SpotLight) {

                helper = new THREE.SpotLightHelper(object, 1);

            } else if (object instanceof THREE.HemisphereLight) {

                helper = new THREE.HemisphereLightHelper(object, 1);

            } else if (object instanceof THREE.SkinnedMesh) {

                helper = new THREE.SkeletonHelper(object);

            } else {

                // no helper for this object type
                return;

            }

            var picker = new THREE.Mesh(geometry, material);
            picker.name = 'picker';
            picker.userData.object = object;
            helper.add(picker);

            this.sceneHelpers.add(helper);
            this.helpers[object.id] = helper;

            this.signals.helperAdded.dispatch(helper);

        };

    }(),

    removeHelper: function (object) {

        if (this.helpers[object.id] !== undefined) {

            var helper = this.helpers[object.id];
            helper.parent.remove(helper);

            delete this.helpers[object.id];

            this.signals.helperRemoved.dispatch(helper);

        }

    },

    //

    getObjectMaterial: function (object, slot) {

        var material = object.material;

        if (Array.isArray(material)) {

            material = material[slot];

        }

        return material;

    },

    setObjectMaterial: function (object, slot, newMaterial) {

        if (Array.isArray(object.material)) {

            object.material[slot] = newMaterial;

        } else {

            object.material = newMaterial;

        }

    },

    //

    select: function (object) {

        if (this.selected === object) return;

        var uuid = null;

        if (object !== null) {

            uuid = object.uuid;

        }

        this.selected = object;

        this.config.setKey('selected', uuid);
        this.signals.objectSelected.dispatch(object);

    },

    selectById: function (id) {

        if (id === this.camera.id) {

            this.select(this.camera);
            return;

        }

        this.select(this.scene.getObjectById(id, true));

    },

    selectByUuid: function (uuid) {

        var scope = this;

        this.scene.traverse(function (child) {

            if (child.uuid === uuid) {

                scope.select(child);

            }

        });

    },

    deselect: function () {

        this.select(null);

    },

    clear: function () {

        this.history.clear();
        this.storage.clear();

        this.camera.copy(this.DEFAULT_CAMERA);
        this.scene.background.setHex(0x464646);
        this.scene.fog = null;

        var objects = this.scene.children;

        while (objects.length > 0) {

            this.removeObject(objects[0]);

        }

        this.geometries = {};
        this.materials = {};
        this.textures = {};
        this.scripts = {};

        this.deselect();
    },

    //

    fromJSON: function (json) {

        var loader = new THREE.ObjectLoader();

        // backwards

        if (json.scene === undefined) {

            this.setScene(loader.parse(json));
            return;

        }

        var camera = loader.parse(json.camera);

        this.camera.copy(camera);
        // this.camera.aspect = this.DEFAULT_CAMERA.aspect;
        this.camera.updateProjectionMatrix();

        this.history.fromJSON(json.history);
        this.scripts = json.scripts;

        this.setScene(loader.parse(json.scene));

    },

    toJSON: function () {

        // scripts clean up

        var scene = this.scene;
        var scripts = this.scripts;

        for (var key in scripts) {

            var script = scripts[key];

            if (script.length === 0 || scene.getObjectByProperty('uuid', key) === undefined) {

                delete scripts[key];

            }

        }

        //

        return {

            metadata: {},
            project: {
                gammaInput: this.config.getKey('project/renderer/gammaInput'),
                gammaOutput: this.config.getKey('project/renderer/gammaOutput'),
                shadows: this.config.getKey('project/renderer/shadows'),
                vr: this.config.getKey('project/vr')
            },
            camera: this.camera.toJSON(),
            scene: this.scene.toJSON(),
            scripts: this.scripts,
            history: this.history.toJSON()

        };

    },

    objectByUuid: function (uuid) {

        return this.scene.getObjectByProperty('uuid', uuid, true);

    },

    execute: function (cmd, optionalName) {

        this.history.execute(cmd, optionalName);

    },

    undo: function () {

        this.history.undo();

    },

    redo: function () {

        this.history.redo();

    }

};
