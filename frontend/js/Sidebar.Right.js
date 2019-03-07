var SidebarRight = function (editor) {

    var container = new UI.Panel();
    container.setId('sidebar_right');
    container.dom.style.zIndex = '4';

    var titleCamera = new UI.Text('Camera');
    titleCamera.addClass('h4');
    titleCamera.setTextAlign('center');
    titleCamera.setColor('whitesmoke');
    titleCamera.setWidth('200px');
    titleCamera.setBackgroundColor('blueviolet');
    container.add(titleCamera);

    var faceView = new FaceView(editor);
    container.add(faceView);

    // choose boy or girl

    // title

    let titleMode = new UI.Text('Setting');
    titleMode.addClass('h4');
    titleMode.setTextAlign('center');
    titleMode.setColor('whitesmoke');
    titleMode.setWidth('200px');
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
    boyLabel.setWidth('100px');
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
    girlLabel.setWidth('100px');
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

    // var titleValence = new UI.Text('Valence');
    // titleValence.addClass('h4');
    // titleValence.setTextAlign('center');
    // titleValence.setColor('whitesmoke');
    // titleValence.setWidth('200px');
    // titleValence.setBackgroundColor('blueviolet');
    // container.add(titleValence);
    //
    // var valenceView = new UI.Div();
    // valenceView.setId('valenceView');
    // valenceView.dom.style.textAlign = 'center';
    // valenceView.dom.style.padding = '5px';
    //
    // var valenceImg = document.createElement("img");
    // valenceImg.src = './asset/valence_new/5.png';
    // valenceImg.style.verticalAlign = 'middle';
    // valenceView.dom.appendChild(valenceImg);
    //
    // var valenceText = new UI.Div();
    // valenceText.setId('valenceText');
    // valenceText.setWidth('60px');
    // valenceText.setHeight('20px');
    // // valenceText.setTextContent('5');
    // valenceText.setTextContent('0');
    // valenceText.setColor('black');
    // valenceText.setBackgroundColor('yellow');
    // valenceText.setMargin('5px');
    // valenceText.setMarginLeft('70px');
    // valenceText.setTextAlign('center');
    // valenceText.dom.style.borderRadius = '10px';
    //
    // // var valenceSlider = new UI.Div();
    // // valenceSlider.setId('valenceSlider');
    //
    // container.add(valenceView);
    // container.add(valenceText);
    // // container.add(valenceSlider);
    //
    // let titleArousal = new UI.Text('Arousal');
    // titleArousal.addClass('h4');
    // titleArousal.setTextAlign('center');
    // titleArousal.setColor('whitesmoke');
    // titleArousal.setMarginTop('15px');
    // titleArousal.setWidth('200px');
    // titleArousal.setBackgroundColor('blueviolet');
    // container.add(titleArousal);
    //
    // var heartView = new UI.Div();
    // heartView.setId('heartView');
    // heartView.setClass('heart animated');
    //
    // var heartValueText = new UI.Div();
    // heartValueText.setId('heartValueText');
    // heartValueText.setWidth('60px');
    // heartValueText.setHeight('20px');
    // // heartValueText.setTextContent('70');
    // heartValueText.setTextContent('0');
    // heartValueText.setColor('black');
    // heartValueText.setBackgroundColor('red');
    // heartValueText.setMargin('5px');
    // heartValueText.setMarginLeft('70px');
    // heartValueText.setTextAlign('center');
    // heartValueText.dom.style.borderRadius = '15px';
    //
    // // var heartSlider = new UI.Div();
    // // heartSlider.setId('heartSlider');
    //
    // container.add(heartView);
    // container.add(heartValueText);
    // container.add(heartSlider);

    // $(function () {
    //
    //     let heart = document.getElementsByClassName('heart')[0];
    //
    //     $("#heartSlider").slider({
    //         value: 70,
    //         min: 50,
    //         max: 90,
    //         slide: function (event, ui) {
    //             $(heartValueText.dom).text(ui.value);
    //             let val = Math.floor(-15 * ui.value + 2100);
    //             heart.style.animation = val + 'ms pulsate infinite alternate ease-in-out';
    //         }
    //     });
    //
    //     $("#valenceSlider").slider({
    //         value: 5,
    //         min: 1,
    //         max: 9,
    //         slide: function (event, ui) {
    //             $(valenceText.dom).text(ui.value);
    //             let res = ui.value;
    //             valenceImg.src = './asset/valence_new/' + res + '.png';
    //         }
    //     });
    // });


    // editor.signals.updateCurrentDetectedEmotionIntensity.add(function (seven_emotions) {
    //     let angery = seven_emotions['angry'];
    //     let disgusted = seven_emotions['disgusted'];
    //     let fearful = seven_emotions['fearful'];
    //     let happy = seven_emotions['happy'];
    //     let sad = seven_emotions['sad'];
    //
    //     let valence = -0.51*angery -0.4*disgusted-0.64*fearful+0.4*happy-0.4*sad;
    //     let arousal = 0.59*angery+0.2*disgusted+0.6*fearful+0.2*happy-0.2*sad;
    //
    //     // valence = Math.floor((valence+2)/2);
    //     // valence = Math.max(9, valence);
    //     // valence = Math.min(1, valence);
    //
    //     $(valenceText.dom).text(valence);
    //     // $("#valenceSlider").slider('value', valence);
    //     // valenceImg.src = './asset/valence_new/' + valence + '.png';
    //     //
    //     $(heartValueText.dom).text(arousal);
    //     // $("#heartSlider").slider('value', vals.arousal);
    //     //
    //     // let heart_val = Math.floor(-15 * vals.arousal + 2100);
    //     // let heart = document.getElementsByClassName('heart')[0];
    //     // heart.style.animation = heart_val + 'ms pulsate infinite alternate ease-in-out';
    // });

    return container;
};