function CreateMesh(geo) {
    let geometry;
    let material;
    if (geo == "sphere") {
        geometry = new THREE.SphereGeometry(10, 8, 8);
        material = new THREE.MeshLambertMaterial({
            color: "#ff0000"
        });
    } else {
        geometry = new THREE.BoxGeometry(20, 20, 20);
        material = new THREE.MeshLambertMaterial({
            color: "#00ffcc"
        });
    }

    let mesh = new THREE.Mesh(geometry, material);
    return mesh;
}

function CreateEmitter(obj) {
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