var FaceView = function (editor) {
    let signals = editor.signals;

    let camera_view = new UI.Panel();
    
    let overlayed_panel = new UI.Panel();
    overlayed_panel.setWidth('250px');
    overlayed_panel.setHeight('200px');

    camera_view.add(overlayed_panel);

    // camera

    let video_stream = new UI.Video();
    video_stream.setPosition('absolute');
    video_stream.setId('selfVideo');
    video_stream.dom.width = 250;
    video_stream.dom.height = 200;
    video_stream.setPreload('auto');
    video_stream.setLoop(true);
    video_stream.setPlaysinline(true);
    video_stream.setAutoplay(true);
    video_stream.dom.muted = 'muted';
    let video_streamWidth = video_stream.dom.width;
    let video_streamHeight = video_stream.dom.height;
    overlayed_panel.add(video_stream);

    // drawing layer
    
    let video_stream_overlay = new UI.Canvas();
    video_stream_overlay.setPosition('absolute');
    video_stream_overlay.setId('video_stream_overlay');
    video_stream_overlay.dom.width = 250;
    video_stream_overlay.dom.height = 200;
    overlayed_panel.add(video_stream_overlay);

    // start button
    
    let start_button = new UI.Button('Start');
    start_button.setId('start_button');
    start_button.setType('button');
    start_button.setWidth('100%');
    start_button.dom.style.borderRadius = '5px';

    $(start_button.dom).click(function () {
        TurnONOFFFaceTracking();
    });

    camera_view.add(start_button);
    
    // video stream stuff
    let video_stream_overlay_context = video_stream_overlay.getContext('2d');
    
    // face recognition stuff
    //define canvas for image processing
    let capture_canvas = document.createElement('canvas');
    capture_canvas.width = 250;
    capture_canvas.height = 200;
    let capture_context = capture_canvas.getContext('2d');

    let face_canvas = document.createElement('canvas');
    face_canvas.width = 48;
    face_canvas.height = 48;
    let FaceContext = face_canvas.getContext('2d');

    let left_eye_canvas = document.createElement('canvas');
    left_eye_canvas.width = 24;
    left_eye_canvas.height = 24;
    let left_eye_context = left_eye_canvas.getContext('2d');

    let right_eye_canvas = document.createElement('canvas');
    right_eye_canvas.width = 24;
    right_eye_canvas.height = 24;
    let right_eye_context = right_eye_canvas.getContext('2d');

    let face_landmark_position = null;
    let face_tracking_started = false;

    // Initialization
    {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        window.URL = window.URL || window.webkitURL || window.msURL || window.mozURL;

        function GetUserMediaSuccess(stream) {
            if ("srcObject" in video_stream.dom) {
                video_stream.dom.srcObject = stream;
            } else {
                video_stream.dom.src = (window.URL && window.URL.createObjectURL(stream));
            }

            function adjustVideoProportions() {
                let proportion = video_stream.dom.videoWidth / video_stream.dom.videoHeight;
                video_streamWidth = Math.round(video_streamHeight * proportion);
                video_stream.dom.width = video_streamWidth;
                video_stream_overlay.dom.width = video_streamWidth;
                capture_canvas.width = video_streamWidth;
                overlayed_panel.setWidth(video_streamWidth + 'px');
            }

            video_stream.dom.onloadedmetadata = function () {
                adjustVideoProportions();
                video_stream.dom.play();
            }

            video_stream.dom.onresize = function () {
                adjustVideoProportions();
                if (face_tracking_started) {
                    ctrack.stop();
                    ctrack.reset();
                    ctrack.start(video_stream.dom);
                }
            }
        }

        function GetUserMediaFail() {
        }

        if (navigator.mediaDevices) {
            navigator.mediaDevices.getUserMedia({video: true}).then(GetUserMediaSuccess).catch(GetUserMediaFail);
        } else if (navigator.getUserMedia) {
            navigator.getUserMedia({video: true}, GetUserMediaSuccess, GetUserMediaFail);
        } else {
            alert("Your browser does not seem to support getUserMedia, using a fallback video instead.");
        }

        video_stream.dom.addEventListener('canplay', function () {
            start_button.dom.value = "Start";
            start_button.dom.disabled = null;
        }, false);
    }
    
    // setup model
    let ctrack = new clm.tracker({useWebGL: true});
    ctrack.init();

    let LPFResultValues = [];
    let LPFBufferSize = 20;

    function lpf(nextValue, smoothing) {
        if (LPFResultValues.length < LPFBufferSize) {
            LPFResultValues.push(nextValue);
            return null;
        } else {
            let initial = LPFResultValues.shift();
            LPFResultValues.push(nextValue);

            return LPFResultValues.reduce(function (last, current) {
                let res = {x: 0, y: 0};
                res.x = smoothing * current.x + (1 - smoothing) * last.x;
                res.y = smoothing * current.y + (1 - smoothing) * last.y;
                return res;
            }, initial);
        }
    }

    let request_id = undefined;

    let FaceTracker = new ParticleFilter();
    FaceTracker.init(video_streamWidth, video_streamHeight, 500, 1);

    let pred = null;
    let measurement = null;
    let corr = null;

    function MainLoop() {
        request_id = undefined;

        // predict
        pred = FaceTracker.predict();

        // measure
        measurement = GetFaceLandmark();

        // correct
        if (measurement === null) {
            corr = pred;
        } else {
            corr = FaceTracker.correct(measurement.x, measurement.y);
        }

        // send signal
        if (corr !== null) {

            let lpfCorr = lpf(corr, 0.6);
            if (lpfCorr !== null) {
                let res = {x: 0, y: 0};

                res.x = lpfCorr.x / video_streamWidth - 0.5;
                res.y = lpfCorr.y / video_streamHeight - 0.5;

                res.x *= 10;
                res.y *= 10;

                signals.followFace.dispatch(res);
            }
        }

        DrawLandmark();

        if (editor.GlobalRunningEmotionCMDState.running === false)
            GetFaceEmotion();

        StartMainLoop();
    }

    function StartMainLoop() {
        if (!request_id) {
            request_id = requestAnimationFrame(MainLoop);
        }
    }

    function StopMainLoop() {
        if (request_id) {
            cancelAnimationFrame(request_id);
            request_id = undefined;
        }
    }

    function TurnONOFFFaceTracking() {
        if (start_button.dom.textContent === 'Start') {
            start_button.dom.textContent = 'Stop';

            video_stream.dom.play();
            ctrack.start(video_stream.dom);
            face_tracking_started = true;

            StartMainLoop();
        } else {
            start_button.dom.textContent = 'Start';

            ctrack.stop(video_stream.dom);
            face_tracking_started = false;

            video_stream_overlay_context.clearRect(0, 0, video_streamWidth, video_streamHeight);

            StopMainLoop();
        }
    }

    //load models
    let KerasJS = require("keras-js");
    let ndarray = require("ndarray");
    let ops = require("ndarray-ops");
    const blinkmodelLeft = new KerasJS.Model({
        filepath: './js/face/blink.bin',
        gpu: true
    });
    const blinkmodelRight = new KerasJS.Model({
        filepath: './js/face/blink.bin',
        gpu: true
    });

    const emotionmodel = new KerasJS.Model({
        filepath: './js/face/emotion.bin',
        gpu: true
    });

    function GetFaceEmotion() { // kerasjs
        if (face_landmark_position !== null) {
            let positions = face_landmark_position;

            // open mouth detection
            let mousedist = positions[ 57 ][ 1 ] - positions[ 60 ][ 1 ];
            let mouthwidth = positions[ 50 ][ 0 ] - positions[ 44 ][ 0 ];
            if ( mousedist > mouthwidth * 0.18 ) {
            	signals.followMouth.dispatch( 'open' );
            }
            else {
            	signals.followMouth.dispatch( 'close' );
            }

            //Blink & Emotion detection
            eyeRectRight.x = positions[23][0] - 5;
            eyeRectRight.y = positions[24][1] - 7;
            eyeRectRight.w = positions[25][0] - positions[23][0] + 10;
            eyeRectRight.h = positions[26][1] - positions[24][1] + 14;

            eyeRectLeft.x = positions[30][0] - 5;
            eyeRectLeft.y = positions[29][1] - 7;
            eyeRectLeft.w = positions[28][0] - positions[30][0] + 10;
            eyeRectLeft.h = positions[31][1] - positions[29][1] + 14;

            FaceRect.x = positions[0][0] - 20;
            FaceRect.y = positions[20][1] - 30;
            //FaceRect.w = positions[14][0] - positions[0][0] + 10;
            FaceRect.w = FaceRect.h = positions[7][1] - positions[20][1] + 30;

            let width = 24;
            let height = 24;
            capture_context.drawImage(video_stream.dom, 0, 0, video_streamWidth, video_streamHeight);

            left_eye_context.drawImage(capture_canvas, eyeRectLeft.x, eyeRectLeft.y, eyeRectLeft.w, eyeRectLeft.h, 0, 0, left_eye_canvas.width, left_eye_canvas.height);
            let LeftImageData = left_eye_context.getImageData(0, 0, left_eye_canvas.width, left_eye_canvas.height);
            let LeftImageGray = grayscale(LeftImageData, 0.5);
            let LeftEyedata = LeftImageGray.data;

            right_eye_context.drawImage(capture_canvas, eyeRectRight.x, eyeRectRight.y, eyeRectRight.w, eyeRectRight.h, 0, 0, right_eye_canvas.width, right_eye_canvas.height);
            let RightImageData = right_eye_context.getImageData(0, 0, right_eye_canvas.width, right_eye_canvas.height);
            let RightImageGray = grayscale(RightImageData, 0.5);
            let RightEyedata = RightImageGray.data;

            FaceContext.drawImage(capture_canvas, FaceRect.x, FaceRect.y, FaceRect.w, FaceRect.h, 0, 0, face_canvas.width, face_canvas.height);
            let FaceImageData = FaceContext.getImageData(0, 0, face_canvas.width, face_canvas.height);
            let FaceImageGray = grayscale(FaceImageData, 0.1); //, 0.2 );
            let Facedata = FaceImageGray.data;

            blinkmodelLeft.ready().then(() => {
                let dataTensor = ndarray(new Float32Array(LeftEyedata), [width, height, 4])
                let dataProcessedTensor = ndarray(new Float32Array(width * height * 3), [width, height, 3])
                ops.divseq(dataTensor, 255)
                ops.subseq(dataTensor, 0.5)
                ops.mulseq(dataTensor, 2)
                ops.assign(dataProcessedTensor.pick(null, null, 0), dataTensor.pick(null, null, 0))
                ops.assign(dataProcessedTensor.pick(null, null, 1), dataTensor.pick(null, null, 1))
                ops.assign(dataProcessedTensor.pick(null, null, 2), dataTensor.pick(null, null, 2))
                let preprocessedData = dataProcessedTensor.data;
                let inputData = {"input": preprocessedData}
                return blinkmodelLeft.predict(inputData)
            }).then(outputData => {
                if (outputData.output < 0.2) {
                    signals.followLeftEye.dispatch('close');
                } else {
                    signals.followLeftEye.dispatch('open');
                }
            }).catch(err => {
                console.log(err)
            })

            blinkmodelRight.ready()
                .then(() => {
                    let dataTensor = ndarray(new Float32Array(RightEyedata), [width, height, 4])
                    let dataProcessedTensor = ndarray(new Float32Array(width * height * 3), [width, height, 3])
                    ops.divseq(dataTensor, 255)
                    ops.subseq(dataTensor, 0.5)
                    ops.mulseq(dataTensor, 2)
                    ops.assign(dataProcessedTensor.pick(null, null, 0), dataTensor.pick(null, null, 0))
                    ops.assign(dataProcessedTensor.pick(null, null, 1), dataTensor.pick(null, null, 1))
                    ops.assign(dataProcessedTensor.pick(null, null, 2), dataTensor.pick(null, null, 2))
                    let preprocessedData = dataProcessedTensor.data;
                    let inputData = {"input": preprocessedData}
                    return blinkmodelRight.predict(inputData)
                }).then(outputData => {
                if (outputData.output < 0.2
                ) {
                    signals.followRightEye.dispatch('close');
                } else {
                    signals.followRightEye.dispatch('open');
                }
            }).catch(err => {
                console.log(err)
            })

            emotionmodel.ready().then(() => {
                let dataTensor = ndarray(new Float32Array(Facedata), [face_canvas.width, face_canvas.height, 4]);
                let dataProcessedTensor = ndarray(new Float32Array(face_canvas.width * face_canvas.height * 1), [face_canvas.width, face_canvas.height, 1]);

                ops.divseq(dataTensor, 255)
                ops.subseq(dataTensor, 0.5)
                ops.mulseq(dataTensor, 2)
                ops.assign(dataProcessedTensor.pick(null, null, 0), dataTensor.pick(null, null, 0))
                let preprocessedData = dataProcessedTensor.data
                let inputData = {"input": preprocessedData}
                return emotionmodel.predict(inputData)
            }).then(outputData => {
                let seven_emotions = {
                    'angry': outputData.output[0],
                    'disgusted': outputData.output[1],
                    'fearful': outputData.output[2],
                    'happy': outputData.output[3],
                    'sad': outputData.output[4],
                    'surprised': outputData.output[5],
                    'neutral': outputData.output[6]
                };
                let best_emotion = null;
                let best_val = -1;
                for(let prop in seven_emotions){
                    // if(prop=='neutral') continue;
                    if(seven_emotions[prop]>best_val){
                        best_val = seven_emotions[prop];
                        best_emotion = prop;
                    }
                }
                editor.current_emotion = best_emotion;
                console.log(editor.current_emotion);
                signals.updateCurrentDetectedEmotionIntensity.dispatch(seven_emotions);

            }).catch(err => {
                console.log(err)
            });
        }
    }

    function GetFaceLandmark() {
        let positions = ctrack.getCurrentPosition();

        if (positions) {
            face_landmark_position = positions;

            let resX = 0;
            let resY = 0;
            for (let i = 0; i < positions.length; ++i) {
                resX += positions[i][0];
                resY += positions[i][1];
            }

            resX /= positions.length;
            resY /= positions.length;

            return {
                'x': resX,
                'y': resY
            };
        } else
            return null;
    }

    function DrawLandmark() {
        video_stream_overlay_context.clearRect(0, 0, video_streamWidth, video_streamHeight);

        if (pred !== null) {
            video_stream_overlay_context.strokeStyle = '#FF0000';
            video_stream_overlay_context.strokeRect(pred.x - 5, pred.y - 5, 10, 10);
        }

        if (measurement != null) {
            video_stream_overlay_context.strokeStyle = '#ff6dcb';
            video_stream_overlay_context.strokeRect(measurement.x - 5, measurement.y - 5, 10, 10);
        }

        if (corr !== null) {
            video_stream_overlay_context.strokeStyle = '#0004ff';
            video_stream_overlay_context.strokeRect(corr.x - 5, corr.y - 5, 10, 10);
        }

        if (ctrack.getCurrentPosition()) {
            ctrack.draw(video_stream_overlay.dom);
        }
    }

    return camera_view;
}