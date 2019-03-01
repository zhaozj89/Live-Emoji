var Audienceview = function (editor) {
    var audienceView = new UI.Panel();
    audienceView.setTop( '0px' );
    // audienceView.setRight( '0px' );
    audienceView.setPosition( 'absolute' );
    audienceView.setDisplay( 'none' );

    let audienceViewHeader = new UI.Text( 'Audience View' );
    audienceViewHeader.setWidth( '100%' );
    audienceViewHeader.setPadding( '10px' );
    audienceViewHeader.dom.style.borderRadius = '5px';
    audienceViewHeader.setBackgroundColor( 'rgba(50, 50, 50, 0.5)' );

    audienceView.add( audienceViewHeader );

    let studentButtonSVG = ( function () {
        let svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
        svg.setAttribute( 'width', 32 );
        svg.setAttribute( 'height', 32 );
        let path = document.createElementNS( 'http://www.w3.org/2000/svg', 'path' );
        path.setAttribute( 'd', 'M 12,12 L 22,22 M 22,12 12,22' );
        path.setAttribute( 'stroke', '#fff' );
        svg.appendChild( path );
        return svg;
    } )();

    let studentClose = new UI.Element( studentButtonSVG );
    studentClose.setPosition( 'absolute' );
    studentClose.setTop( '3px' );
    studentClose.setRight( '1px' );
    studentClose.setCursor( 'pointer' );

    studentClose.onClick( function () {
        audienceView.setDisplay( 'none' );
    } );

    audienceViewHeader.add( studentClose );

    let audienceRenderedView = new UI.Panel();
    audienceRenderedView.setWidth( '500px' );
    audienceRenderedView.setHeight( '400px' );
    audienceRenderedView.setBackgroundColor( 'rgba(120, 120, 120, 0.6)' );

    editor.side_view = audienceRenderedView;
    editor.audience_view = audienceView;

    audienceView.add( audienceRenderedView );

    return audienceView;
}
