function gray(pixels) {
    const d = pixels.data;
    var graypixel_data = new Array();
    ;
    for (let i = 0; i < d.length; i += 4) {
        const r = d[i + 0];
        const g = d[i + 1];
        const b = d[i + 2];
        const a = d[i + 3];
        let v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        //let v = 0.3 * r + 0.59 * g + 0.11 * b;
        graypixel_data[i * 3 / 4 + 0] = graypixel_data[i * 3 / 4 + 1] = graypixel_data[i * 3 / 4 + 2] = v;
    }
    var graypixel = {
        data: graypixel_data,
        width: pixels.width,
        height: pixels.height
    };
    return graypixel;
}

function grayscale(pixels, brightness) {
    const d = pixels.data;
    var n = 0;
    var m = -1;
    for (let i = 0; i < d.length; i += 4) {
        const r = d[i + 0];
        const g = d[i + 1];
        const b = d[i + 2];
        const a = d[i + 3];
        let v = 0.2126 * r + 0.7152 * g + 0.0722 * b; ////let v = 0.3 * r + 0.59 * g + 0.11 * b;
        v /= a;
        v += brightness;
        v *= a;
        v = Math.min(255, v);
        d[i + 0] = d[i + 1] = d[i + 2] = v;
    }
    return pixels;
}

var eyeRectRight = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
};
var eyeRectLeft = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
};

var FaceRect = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
};