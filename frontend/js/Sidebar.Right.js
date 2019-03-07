var SidebarRight = function (editor) {

    var container = new UI.Panel();
    container.setId('sidebar_right');
    container.dom.style.zIndex = '4';

    var titleCamera = new UI.Text('Camera');
    titleCamera.addClass('h4');
    titleCamera.setTextAlign('center');
    titleCamera.setColor('whitesmoke');
    titleCamera.setWidth('250px');
    titleCamera.setBackgroundColor('blueviolet');
    container.add(titleCamera);

    var faceView = new FaceView(editor);
    container.add(faceView);

    //

    var titleEmotion = new UI.Text('Emotion');
    titleEmotion.addClass('h4');
    titleEmotion.setTextAlign('center');
    titleEmotion.setColor('whitesmoke');
    titleEmotion.setWidth('250px');
    titleEmotion.setBackgroundColor('blueviolet');
    container.add(titleEmotion);

    let emotion_bar_chart_canvas = new UI.Canvas();
    let ctx = emotion_bar_chart_canvas.dom.getContext('2d');
    let emotion_bar_chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Angry", "Disgusted", "Fearful", "Happy", "Sad", "Surprised"],
            datasets: [{
                data: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 0.5
            }]
        },
        options: {
            legend:{
                display:false
            },
            scales: {
                yAxes: [{
                    ticks: {
                        min: 0,
                        max: 1,
                        beginAtZero:true
                    }
                }]
            }
        }
    });

    container.add(emotion_bar_chart_canvas);

    // choose boy or girl

    // title

    let titleMode = new UI.Text('Setting');
    titleMode.addClass('h4');
    titleMode.setTextAlign('center');
    titleMode.setColor('whitesmoke');
    titleMode.setWidth('250px');
    titleMode.setBackgroundColor('blueviolet');
    container.add(titleMode);

    let characterButtons = new UI.Div();
    characterButtons.setMargin('5px');
    characterButtons.addClass('btn-group');
    characterButtons.addClass('btn-group-toggle');
    characterButtons.dom.setAttribute('data-toggle', 'buttons');
    container.add(characterButtons);

    let boyLabel = new UI.Label();
    boyLabel.addClass('btn');
    boyLabel.addClass('btn-secondary');
    boyLabel.setWidth('125px');
    characterButtons.add(boyLabel);
    boyLabel.dom.innerHTML = 'Boy';

    let boyInput = new UI.Input('');
    boyInput.dom.setAttribute('type', 'radio');
    boyInput.dom.setAttribute('name', 'options');
    boyInput.dom.setAttribute('autocomplete', 'off');
    boyLabel.add(boyInput);

    let girlLabel = new UI.Label();
    girlLabel.addClass('btn');
    girlLabel.addClass('btn-secondary');
    girlLabel.setWidth('125px');
    characterButtons.add(girlLabel);
    girlLabel.dom.innerHTML = 'Girl';

    let girlInput = new UI.Input('');
    girlInput.dom.setAttribute('type', 'radio');
    girlInput.dom.setAttribute('name', 'options');
    girlInput.dom.setAttribute('autocomplete', 'off');
    girlLabel.add(girlInput);

    editor.boyLabel = boyLabel;
    editor.girlLabel = girlLabel;

    boyLabel.dom.onclick = function () {

        if (editor.boyLoaded === false) {
            alert('Please load boy character first!');
            return;
        }

        if (editor.boy !== null) {
            editor.selected = editor.boy;
            editor.boy.visible = true;

            if (editor.girl !== null)
                editor.girl.visible = false;
        }

        boyLabel.addClass('active');
        girlLabel.removeClass('active');

        boyLabel.setOpacity('1');
        girlLabel.setOpacity('0.2');
    }

    girlLabel.dom.onclick = function () {

        if (editor.girlLoaded === false) {
            alert('Please load girl character first!');
            return;
        }

        if (editor.girl !== null) {
            editor.selected = editor.girl;
            editor.girl.visible = true;

            if (editor.boy !== null)
                editor.boy.visible = false;
        }

        boyLabel.removeClass('active');
        girlLabel.addClass('active');

        boyLabel.setOpacity('0.2');
        girlLabel.setOpacity('1');
    }

    boyLabel.setOpacity('0.2');
    girlLabel.setOpacity('0.2');

    editor.signals.updateCurrentDetectedEmotionIntensity.add(function (seven_emotions) {
        let angery = seven_emotions['angry'];
        let disgusted = seven_emotions['disgusted'];
        let fearful = seven_emotions['fearful'];
        let happy = seven_emotions['happy'];
        let sad = seven_emotions['sad'];
        let surprised = seven_emotions['surprised'];

        emotion_bar_chart.data.datasets[0].data[0] = angery;
        emotion_bar_chart.data.datasets[0].data[1] = disgusted;
        emotion_bar_chart.data.datasets[0].data[2] = fearful;
        emotion_bar_chart.data.datasets[0].data[3] = happy;
        emotion_bar_chart.data.datasets[0].data[4] = sad;
        emotion_bar_chart.data.datasets[0].data[5] = surprised;

        emotion_bar_chart.update();
    });

    return container;
};