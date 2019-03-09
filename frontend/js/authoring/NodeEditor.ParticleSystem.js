function CreateMesh(shape, color, size) {
    let geometry;
    let material;
    let color_val = "";
    if(color=="red") color_val="#ff0000";
    if(color=="greed") color_val="#39a971";
    if(color=="blue") color_val="#1008ff";
    if(color=="yellow") color_val="#fff959";
    if(color=="pink") color_val="#ff65a7";

    if (shape == "sphere") {
        geometry = new THREE.SphereGeometry(size, 12, 12);
        material = new THREE.MeshLambertMaterial({
            color: color_val
        });
    }
    if(shape=="box"){
        geometry = new THREE.BoxGeometry(size, size, size);
        material = new THREE.MeshLambertMaterial({
            color: color_val
        });
    }

    let mesh = new THREE.Mesh(geometry, material);
    return mesh;
}

function CreateEmitterWithMesh(obj) {
    let emitter = new Proton.Emitter();
    emitter.rate = new Proton.Rate(new Proton.Span(5, 10), new Proton.Span(.1, .25));
    emitter.addInitialize(new Proton.Mass(1));
    emitter.addInitialize(new Proton.Radius(10));
    emitter.addInitialize(new Proton.Life(2, 4));
    emitter.addInitialize(new Proton.Body(obj.Body));
    emitter.addInitialize(new Proton.Position(new Proton.BoxZone(100)));
    emitter.addInitialize(new Proton.Velocity(200, new Proton.Vector3D(0, 1, 1), 30));

    emitter.addBehaviour(new Proton.Rotate("random", "random"));
    emitter.addBehaviour(new Proton.Scale(1, 0.1));
    //Gravity
    emitter.addBehaviour(new Proton.Gravity(3));

    emitter.p.x = obj.p.x;
    emitter.p.y = obj.p.y;
    return emitter;
}

function CreateSprite(name) {
    let map = new THREE.TextureLoader().load("asset/particle/small/" + name + ".png");
    // let material = new THREE.SpriteMaterial({
    //     map: map,
    //     color: 0xff0000,
    //     blending: THREE.AdditiveBlending,
    //     fog: true
    // });
    // return new THREE.Sprite(material);
    var material = new THREE.SpriteMaterial({
        map: map,
        transparent: true,
        opacity: .5,
        color: 0xffffff
    });
    return new THREE.Sprite(material);
}
//
// function CreateSnow() {
//     var map = new THREE.TextureLoader().load("asset/img/snow.png");
//     var material = new THREE.SpriteMaterial({
//         map: map,
//         transparent: true,
//         opacity: .5,
//         color: 0xffffff
//     });
//     return new THREE.Sprite(material);
// }

function CreateEmitterWithTexture1(name) {
    let emitter = new Proton.Emitter();
    emitter.rate = new Proton.Rate(new Proton.Span(5, 10), new Proton.Span(.1, .25));
    emitter.addInitialize(new Proton.Mass(1));
    emitter.addInitialize(new Proton.Radius(100));
    emitter.addInitialize(new Proton.Life(2, 4));
    emitter.addInitialize(new Proton.Body(CreateSprite(name)));
    emitter.addInitialize(new Proton.Position(new Proton.BoxZone(100)));
    emitter.addInitialize(new Proton.Velocity(200, new Proton.Vector3D(0, 1, 1), 180));

    emitter.addBehaviour(new Proton.RandomDrift(30, 30, 30, .05));
    emitter.addBehaviour(new Proton.Rotate("random", "random"));
    emitter.addBehaviour(new Proton.Scale(1, 0.5));
    emitter.addBehaviour(new Proton.Alpha(1, 0, Infinity, Proton.easeInQuart));
    let zone2 = new Proton.BoxZone(400);
    emitter.addBehaviour(new Proton.CrossZone(zone2, "bound"));
    emitter.addBehaviour(new Proton.Collision(emitter,true));
    emitter.addBehaviour(new Proton.Color(0xff0000, 'random', Infinity, Proton.easeOutQuart));

    let vec = new THREE.Vector3( 0, 0, -100 );
    vec.applyQuaternion( editor.main_camera.quaternion );

    emitter.p.x = vec.x;
    emitter.p.y = vec.y;
    emitter.p.z = vec.z;

    return emitter;
}

function CreateEmitterWithTexture2(name) {
    let emitter = new Proton.Emitter();
    emitter.rate = new Proton.Rate(new Proton.Span(10, 15), new Proton.Span(.05, .1));
    emitter.addInitialize(new Proton.Body(CreateSprite(name)));
    emitter.addInitialize(new Proton.Mass(1));
    emitter.addInitialize(new Proton.Life(1, 3));
    emitter.addInitialize(new Proton.Position(new Proton.SphereZone(20)));
    emitter.addInitialize(new Proton.V(new Proton.Span(500, 800), new Proton.Vector3D(0, 1, 0), 30));
    emitter.addBehaviour(new Proton.RandomDrift(10, 10, 10, .05));
    emitter.addBehaviour(new Proton.Alpha(1, 0.1));
    emitter.addBehaviour(new Proton.Scale(new Proton.Span(2, 3.5), 0));
    emitter.addBehaviour(new Proton.G(6));
    emitter.addBehaviour(new Proton.Color('#FF0026', ['#ffff00', '#ffff11'], Infinity, Proton.easeOutSine));

    let vec = new THREE.Vector3( 0, 0, -100 );
    vec.applyQuaternion( editor.main_camera.quaternion );

    emitter.p.x = vec.x;
    emitter.p.y = vec.y;
    emitter.p.z = vec.z;

    return emitter;
}



function CreateEmitterSnow(name) {
    let emitter = new Proton.Emitter();
    emitter.rate = new Proton.Rate(new Proton.Span(34, 48), new Proton.Span(.2, .5));
    emitter.addInitialize(new Proton.Mass(1));
    emitter.addInitialize(new Proton.Radius(new Proton.Span(10, 20)));

    let position = new Proton.Position();
    position.addZone(new Proton.BoxZone(250, 10, 250));
    emitter.addInitialize(position);

    emitter.addInitialize(new Proton.Life(5, 10));
    emitter.addInitialize(new Proton.Body(CreateSprite(name)));
    emitter.addInitialize(new Proton.Velocity(0, new Proton.Vector3D(0, -1, 0), 90));

    emitter.addBehaviour(new Proton.RandomDrift(10, 1, 10, .05));
    emitter.addBehaviour(new Proton.Rotate("random", "random"));
    emitter.addBehaviour(new Proton.Gravity(2));

    let sceenZone = new Proton.ScreenZone(editor.main_camera, editor.main_view_renderer, 20, "234");
    emitter.addBehaviour(new Proton.CrossZone(sceenZone, "dead"));

    emitter.p.x = 0;
    emitter.p.y = 10;

    return emitter;
}