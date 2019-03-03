var FaceView = function (editor) {
    var signals = editor.signals;

    var cameraView = new UI.Panel();

    let overlayedPanel = new UI.Panel();
    overlayedPanel.setWidth('200px');
    overlayedPanel.setHeight('150px');

    cameraView.add(overlayedPanel);

    // camera

    let videoStream = new UI.Video();
    videoStream.setPosition('absolute');
    videoStream.setId('selfVideo');
    videoStream.dom.width = 200;
    videoStream.dom.height = 150;
    videoStream.setPreload('auto');
    videoStream.setLoop(true);
    videoStream.setPlaysinline(true);
    videoStream.setAutoplay(true);
    videoStream.dom.muted = 'muted';
    let videoStreamWidth = videoStream.dom.width;
    let videoStreamHeight = videoStream.dom.height;
    overlayedPanel.add(videoStream);

    let videoStreamOverlay = new UI.Canvas();
    videoStreamOverlay.setPosition('absolute');
    videoStreamOverlay.setId('videoStreamOverlay');
    videoStreamOverlay.dom.width = 200;
    videoStreamOverlay.dom.height = 150;
    overlayedPanel.add(videoStreamOverlay);

    let startButton = new UI.Button('Start');
    // startButton.setValue( 'wait, loading video' );
    startButton.setId('startButton');
    startButton.setType('button');
    startButton.setWidth('100%');
    startButton.dom.style.borderRadius = '5px';
    // startButton.setDisabled( 'disabled' );

    $(startButton.dom).click(function () {
        TurnONOFFFaceTracking();
    });

    cameraView.add(startButton);


    // video stream stuff
    let videoStreamOverlayContext = videoStreamOverlay.getContext('2d');


    // face recognition stuff
    //define canvas for image processing
    let captureCanvas = document.createElement('canvas');		// internal canvas for capturing full images from video stream
    captureCanvas.width = 200;  //should be the same as videoStream.dom.width in Camera.js
    captureCanvas.height = 150; //should be the same as videoStream.dom.height in Camera.js
    let captureContext = captureCanvas.getContext('2d');

    let FaceCanvas = document.createElement('canvas');
    FaceCanvas.width = 48;
    FaceCanvas.height = 48;
    let FaceContext = FaceCanvas.getContext('2d');

    let LeftEyeCanvas = document.createElement('canvas');
    LeftEyeCanvas.width = 24;
    LeftEyeCanvas.height = 24;
    let LeftEyeContext = LeftEyeCanvas.getContext('2d');

    let RightEyeCanvas = document.createElement('canvas');
    RightEyeCanvas.width = 24;
    RightEyeCanvas.height = 24;
    let RightEyeContext = RightEyeCanvas.getContext('2d');

    let faceLandmarkPosition = null;


    //

    let faceTrackingStarted = false;

    // Initialization
    {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        window.URL = window.URL || window.webkitURL || window.msURL || window.mozURL;

        function GetUserMediaSuccess(stream) {
            if ("srcObject" in videoStream.dom) {
                videoStream.dom.srcObject = stream;
            }
            else {
                videoStream.dom.src = (window.URL && window.URL.createObjectURL(stream));
            }

            function adjustVideoProportions() {
                let proportion = videoStream.dom.videoWidth / videoStream.dom.videoHeight;
                videoStreamWidth = Math.round(videoStreamHeight * proportion);
                videoStream.dom.width = videoStreamWidth;
                videoStreamOverlay.dom.width = videoStreamWidth;

                captureCanvas.width = videoStreamWidth;

                overlayedPanel.setWidth(videoStreamWidth + 'px');
            }

            videoStream.dom.onloadedmetadata = function () {
                adjustVideoProportions();
                videoStream.dom.play();
            }

            videoStream.dom.onresize = function () {
                adjustVideoProportions();
                if (faceTrackingStarted) {
                    ctrack.stop();
                    ctrack.reset();
                    ctrack.start(videoStream.dom);
                }
            }
        }

        function GetUserMediaFail() {
        }

        if (navigator.mediaDevices) {
            navigator.mediaDevices.getUserMedia({video: true}).then(GetUserMediaSuccess).catch(GetUserMediaFail);
        }
        else if (navigator.getUserMedia) {
            navigator.getUserMedia({video: true}, GetUserMediaSuccess, GetUserMediaFail);
        }
        else {
            alert("Your browser does not seem to support getUserMedia, using a fallback video instead.");
        }

        videoStream.dom.addEventListener('canplay', function () {
            startButton.dom.value = "Start";
            startButton.dom.disabled = null;
        }, false);
        //
        // // Provides requestAnimationFrame in a cross browser way
        // window.requestAnimFrame = (function () {
        //     return window.requestAnimationFrame ||
        //         window.webkitRequestAnimationFrame ||
        //         window.mozRequestAnimationFrame ||
        //         window.oRequestAnimationFrame ||
        //         window.msRequestAnimationFrame ||
        //         function (/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
        //             return window.setTimeout(callback, 1000 / 60);
        //         };
        // })();

        // // Provides cancelRequestAnimationFrame in a cross browser way
        // window.cancelRequestAnimFrame = (function () {
        //     return window.cancelAnimationFrame ||
        //         window.webkitCancelRequestAnimationFrame ||
        //         window.mozCancelRequestAnimationFrame ||
        //         window.oCancelRequestAnimationFrame ||
        //         window.msCancelRequestAnimationFrame ||
        //         window.clearTimeout;
        // })();
    }


    // setup model
    let ctrack = new clm.tracker({useWebGL: true});
    ctrack.init();

    let resVals = [];
    let bufSize = 20;

    function lpf(nextValue, smoothing) {
        if (resVals.length < bufSize) {
            resVals.push(nextValue);
            return null;
        }
        else {
            let initial = resVals.shift();
            resVals.push(nextValue);

            return resVals.reduce(function (last, current) {
                let res = {x: 0, y: 0};
                res.x = smoothing * current.x + (1 - smoothing) * last.x;
                res.y = smoothing * current.y + (1 - smoothing) * last.y;
                return res;
            }, initial);
        }
    }

    let requestId = undefined;

    let FaceTracker = new ParticleFilter();
    FaceTracker.init(videoStreamWidth, videoStreamHeight, 500, 1);

    let pred = null;
    let measurement = null;
    let corr = null;

    let fpsInterval, now, then, elapsed;


    function MainLoop() {
        requestId = undefined;

        // predict
        pred = FaceTracker.predict();

        // measure
        measurement = GetFaceLandmark();

        // correct
        if (measurement === null) {
            corr = pred;
        }
        else {
            corr = FaceTracker.correct(measurement.x, measurement.y);
        }

        // send signal
        if (corr !== null) {

            let lpfCorr = lpf(corr, 0.6);
            if (lpfCorr !== null) {
                let res = {x: 0, y: 0};

                res.x = lpfCorr.x / videoStreamWidth - 0.5;
                res.y = lpfCorr.y / videoStreamHeight - 0.5;

                res.x *= 10;
                res.y *= 10;

                signals.followFace.dispatch(res);
            }
        }

        DrawLandmark();

        if (editor.runningEmotionCMDState.running === false)
            GetFaceEmotion();

        StartMainLoop();
    }

    function StartMainLoop() {
        if (!requestId) {
            requestId = requestAnimationFrame(MainLoop);
        }
    }

    function StopMainLoop() {
        if (requestId) {
            cancelAnimationFrame(requestId);
            requestId = undefined;
        }
    }

    function TurnONOFFFaceTracking() {

        if (startButton.dom.textContent === 'Start') {
            startButton.dom.textContent = 'Stop';

            videoStream.dom.play();
            ctrack.start(videoStream.dom);
            faceTrackingStarted = true;

            let fps = 10;
            fpsInterval = 1000 / fps;
            then = Date.now();

            StartMainLoop();
        }
        else {
            startButton.dom.textContent = 'Start';

            ctrack.stop(videoStream.dom);
            faceTrackingStarted = false;

            videoStreamOverlayContext.clearRect(0, 0, videoStreamWidth, videoStreamHeight);

            StopMainLoop();
        }

        editor.facetracking_running = faceTrackingStarted;
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
        if (faceLandmarkPosition !== null) {
            let positions = faceLandmarkPosition;

            // // open mouth detection
            // let mousedist = positions[ 57 ][ 1 ] - positions[ 60 ][ 1 ];
            // let mouthwidth = positions[ 50 ][ 0 ] - positions[ 44 ][ 0 ];
            // if ( mousedist > mouthwidth * 0.18 ) {
            // 	signals.followMouth.dispatch( 'open' );
            // }
            // else {
            // 	signals.followMouth.dispatch( 'close' );
            // }

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
            captureContext.drawImage(videoStream.dom, 0, 0, videoStreamWidth, videoStreamHeight);

            LeftEyeContext.drawImage(captureCanvas, eyeRectLeft.x, eyeRectLeft.y, eyeRectLeft.w, eyeRectLeft.h, 0, 0, LeftEyeCanvas.width, LeftEyeCanvas.height);
            let LeftImageData = LeftEyeContext.getImageData(0, 0, LeftEyeCanvas.width, LeftEyeCanvas.height);
            let LeftImageGray = grayscale(LeftImageData, 0.5);
            let LeftEyedata = LeftImageGray.data;

            RightEyeContext.drawImage(captureCanvas, eyeRectRight.x, eyeRectRight.y, eyeRectRight.w, eyeRectRight.h, 0, 0, RightEyeCanvas.width, RightEyeCanvas.height);
            let RightImageData = RightEyeContext.getImageData(0, 0, RightEyeCanvas.width, RightEyeCanvas.height);
            let RightImageGray = grayscale(RightImageData, 0.5);
            let RightEyedata = RightImageGray.data;

            FaceContext.drawImage(captureCanvas, FaceRect.x, FaceRect.y, FaceRect.w, FaceRect.h, 0, 0, FaceCanvas.width, FaceCanvas.height);
            let FaceImageData = FaceContext.getImageData(0, 0, FaceCanvas.width, FaceCanvas.height);
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
            } ).then(outputData => {
                if(outputData.output < 0.2){
                signals.followLeftEye.dispatch('close');
            }
            else{
                signals.followLeftEye.dispatch('open');
            }} ).catch(err => {
                console.log(err)
            } )

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
        } ).then(outputData => {
                if(outputData.output < 0.2
        ){
                signals.followRightEye.dispatch('close');
            }
        else
            {
                signals.followRightEye.dispatch('open');
            }
        } ).catch(err => {
                console.log(err)
        } )

            emotionmodel.ready().then(() => {
                let dataTensor = ndarray(new Float32Array(Facedata), [FaceCanvas.width, FaceCanvas.height, 4]);
            let dataProcessedTensor = ndarray(new Float32Array(FaceCanvas.width * FaceCanvas.height * 1), [FaceCanvas.width, FaceCanvas.height, 1]);

            ops.divseq(dataTensor, 255)
            ops.subseq(dataTensor, 0.5)
            ops.mulseq(dataTensor, 2)
            ops.assign(dataProcessedTensor.pick(null, null, 0), dataTensor.pick(null, null, 0))
            let preprocessedData = dataProcessedTensor.data
            let inputData = {"input": preprocessedData}
            return emotionmodel.predict(inputData)
        } ).then(outputData => {
                let valence_level = {
                    'angry': outputData.output[0],
                    'disgusted': outputData.output[1],
                    'fearful': outputData.output[2],
                    'happy': outputData.output[3],
                    'sad': outputData.output[4],
                    'surprised': outputData.output[5],
                    'neutral': outputData.output[6]
                };

            signals.updateRecommendation.dispatch(valence_level);
        } ).catch(err => {
                console.log(err)
        } );
        }
    }

    function GetFaceLandmark() {
        let positions = ctrack.getCurrentPosition();

        if (positions) {
            faceLandmarkPosition = positions;

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
        }
        else
            return null;
    }

    function DrawLandmark() {
        videoStreamOverlayContext.clearRect(0, 0, videoStreamWidth, videoStreamHeight);

        if (pred !== null) {
            videoStreamOverlayContext.strokeStyle = '#FF0000';
            videoStreamOverlayContext.strokeRect(pred.x - 5, pred.y - 5, 10, 10);
        }

        if (measurement != null) {
            videoStreamOverlayContext.strokeStyle = '#ff6dcb';
            videoStreamOverlayContext.strokeRect(measurement.x - 5, measurement.y - 5, 10, 10);
        }

        if (corr !== null) {
            videoStreamOverlayContext.strokeStyle = '#0004ff';
            videoStreamOverlayContext.strokeRect(corr.x - 5, corr.y - 5, 10, 10);
        }

        if (ctrack.getCurrentPosition()) {
            ctrack.draw(videoStreamOverlay.dom);
        }
    }


    return cameraView;
}