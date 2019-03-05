var AudienceView = function (editor) {
    var audienceView = new UI.Panel();

    let audienceRenderedView = new UI.Panel();
    audienceRenderedView.setWidth('300px');
    audienceRenderedView.setHeight('200px');
    audienceRenderedView.setBackgroundColor('rgba(120, 120, 120, 0.6)');

    editor.side_view = audienceRenderedView;

    audienceView.add(audienceRenderedView);

    return audienceView;
}
