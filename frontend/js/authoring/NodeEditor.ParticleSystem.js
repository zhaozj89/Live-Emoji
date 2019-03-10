function CreateSprite(name) {
    let map = new THREE.TextureLoader().load("asset/particle/small/" + name + ".png");
    let material = new THREE.SpriteMaterial({
        map: map,
        transparent: true,
        opacity: .5,
        color: 0xffffff
    });
    let sprite = new THREE.Sprite(material);

    return sprite;
}

function CreateEmitterWithConfiguration1(config) {
    let anchor = config['anchor'];
    let direction = config['direction'];
    let texture_name = config['texture_name'];
    let scale = config['scale'];
    let velocity = config['velocity'];

    anchor.applyQuaternion( editor.main_camera.quaternion );
    direction.applyQuaternion( editor.main_camera.quaternion );

    let emitter = new Proton.Emitter();
    emitter.rate = new Proton.Rate(new Proton.Span(5, 10), new Proton.Span(100, 500));
    emitter.addInitialize(new Proton.Mass(1));
    emitter.addInitialize(new Proton.Radius(scale));
    emitter.addInitialize(new Proton.Life(2, 15));
    emitter.addInitialize(new Proton.Body(CreateSprite(texture_name)));
    emitter.addInitialize(new Proton.Position(new Proton.BoxZone(10)));
    emitter.addInitialize(new Proton.Velocity(velocity, new Proton.Vector3D(direction.x, direction.y, direction.z), velocity));

    // emitter.addBehaviour(new Proton.RandomDrift(10, 10, 10, .05));
    // emitter.addBehaviour(new Proton.Rotate("random", "random"));
    // emitter.addBehaviour(new Proton.Scale(1, 0.5));
    emitter.addBehaviour(new Proton.Alpha(1, 0, Infinity, Proton.easeInQuart));
    // let zone2 = new Proton.BoxZone(100);
    // emitter.addBehaviour(new Proton.CrossZone(zone2, "bound"));
    emitter.addBehaviour(new Proton.Collision(emitter,true));
    emitter.addBehaviour(new Proton.Color(0xff0000, 'random', Infinity, Proton.easeOutQuart));


    emitter.p.x = anchor.x;
    emitter.p.y = anchor.y;
    emitter.p.z = anchor.z;

    return emitter;
}

function CreateEmitterWithConfiguration2(config) {
    let anchor = config['anchor'];
    let direction = config['direction'];
    let texture_name = config['texture_name'];
    let scale = config['scale'];
    let velocity = config['velocity'];

    anchor.applyQuaternion( editor.main_camera.quaternion );
    direction.applyQuaternion( editor.main_camera.quaternion );

    let emitter = new Proton.Emitter();
    emitter.rate = new Proton.Rate(new Proton.Span(30, 50), new Proton.Span(.2, .5));
    emitter.addInitialize(new Proton.Mass(1));
    emitter.addInitialize(new Proton.Radius(new Proton.Span(scale)));

    let position = new Proton.Position();
    position.addZone(new Proton.BoxZone(anchor.x, anchor.y, anchor.z, 100, 100, 100));
    emitter.addInitialize(position);

    emitter.addInitialize(new Proton.Life(1, 10));
    emitter.addInitialize(new Proton.Body(CreateSprite(texture_name)));
    emitter.addInitialize(new Proton.Velocity(velocity, new Proton.Vector3D(direction.x, direction.y, direction.z), velocity));

    // emitter.addBehaviour(new Proton.RandomDrift(10, 1, 10, .05));
    // emitter.addBehaviour(new Proton.Rotate("random", "random"));
    // emitter.addBehaviour(new Proton.Gravity(2));


    emitter.addBehaviour(new Proton.Alpha(1, 0, Infinity, Proton.easeInQuart));
    // let zone2 = new Proton.BoxZone(100);
    // emitter.addBehaviour(new Proton.CrossZone(zone2, "bound"));
    // emitter.addBehaviour(new Proton.Collision(emitter,true));
    // emitter.addBehaviour(new Proton.Color(0xff0000, 'random', Infinity, Proton.easeOutQuart));

    let sceenZone = new Proton.ScreenZone(editor.main_camera, editor.main_view_renderer, 20, "234");
    emitter.addBehaviour(new Proton.CrossZone(sceenZone, "dead"));

    emitter.p.x = anchor.x;
    emitter.p.y = anchor.y;
    emitter.p.z = anchor.z;

    return emitter;
}


function CreateAttractionWithConfiguration(config){
    let position = config['position'];
    let force = config['force'];
    let region = config['region'];

    position.applyQuaternion( editor.main_camera.quaternion );

    return new Proton.Attraction(position, force, region);
}