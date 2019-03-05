var MainView = function (editor) {
    var container = new UI.Panel();
    container.setId('mainview');
    container.setPosition('absolute');
    // container.dom.style.zIndex = '0';

    var renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.dom.offsetWidth, container.dom.offsetHeight);
    container.dom.appendChild(renderer.domElement);

    editor.main_view_renderer = renderer;
    editor.main_view = container;

    return container;
};
