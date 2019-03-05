function _GetTexturesFromAtlasFile(atlasImgUrl, tilesNum) {
    var textures = [];
    for (var i = 0; i < tilesNum; i++) {
        textures[i] = new THREE.Texture();
    }
    var loader = new THREE.ImageLoader();
    loader.load(atlasImgUrl, function (imageObj) {
        var canvas, context;
        var tileWidth = imageObj.height;
        for (var i = 0; i < textures.length; i++) {
            canvas = document.createElement('canvas');
            context = canvas.getContext('2d');
            canvas.height = tileWidth;
            canvas.width = tileWidth;
            context.drawImage(imageObj, tileWidth * i, 0, tileWidth, tileWidth, 0, 0, tileWidth, tileWidth);
            textures[i].image = canvas;
            textures[i].needsUpdate = true;
        }
    });
    return textures;
}

var MakeScene = function () {
    let scene = new THREE.Scene();

    // test
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    var geometry = new THREE.BoxBufferGeometry(100, 100, 100);
    geometry.scale(1, 1, -1);
    var textures = _GetTexturesFromAtlasFile("./asset/sun_temple_stripe_stereo.jpg", 12);
    var materials = [];
    for (var i = 0; i < 6; i++) {
        materials.push(new THREE.MeshBasicMaterial({map: textures[i]}));
    }
    var skyBox = new THREE.Mesh(geometry, materials);
    skyBox.layers.set(1);
    scene.add(skyBox);

    // light
    var ambientLight = new THREE.AmbientLight(0x101010);
    scene.add(ambientLight);

    var pointLight = new THREE.PointLight(0xffffff, 2, 100, 1);
    pointLight.position.set(0, 20, 20);
    scene.add(pointLight);

    var spotLight = new THREE.SpotLight(0xffffff, .5);
    spotLight.position.set(0, 50, 10);
    scene.add(spotLight);
    spotLight.lookAt(scene);

    return scene;
}
