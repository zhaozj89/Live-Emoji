"use strict";
var LoadEmotionCMDJSONFile = function ( editor, filename ) {

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if ( this.readyState == 4 && this.status == 200 ) {
            let jsonFile = JSON.parse( this.responseText );

            editor.emotionCMDManager.fromJSON( jsonFile );

            editor.emotionCMDManager.cleanSVG();

            for ( let prop in editor.emotionCMDManager.allSerializedCMDs ) {

                let info = editor.emotionCMDManager.allCMDs[ prop ].getInfo();

                let msg = {
                    'info': info,
                    'nodeString': editor.emotionCMDManager.allSerializedCMDs[ prop ]
                };

                editor.signals.saveEmotionCMD.dispatch( msg );
            }
        }
    };

    xhr.open( 'GET', './asset/' + filename, true );
    xhr.send();
}

var NEditor2 = function ( editor ) {

    let signals = editor.signals;

    let container = new UI.Panel();
    container.setId( 'nEditor' );
    container.setPosition( 'absolute' );
    container.setBackgroundColor( 'rgba(20,20,20,0.5)' );
    container.setDisplay( 'none' );

    container.dom.style.zIndex = "5";

    editor.node_editor = container;

    var header = new UI.Panel();
    header.setPadding( '10px' );
    container.add( header );

    var title = new UI.Text().setColor( '#fff' );
    header.add( title );

    var buttonSVG = ( function () {
        var svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
        svg.setAttribute( 'width', 32 );
        svg.setAttribute( 'height', 32 );
        var path = document.createElementNS( 'http://www.w3.org/2000/svg', 'path' );
        path.setAttribute( 'd', 'M 12,12 L 22,22 M 22,12 12,22' );
        path.setAttribute( 'stroke', '#fff' );
        svg.appendChild( path );
        return svg;
    } )();

    var close = new UI.Element( buttonSVG );
    close.setPosition( 'absolute' );
    close.setTop( '3px' );
    close.setRight( '1px' );
    close.setCursor( 'pointer' );
    close.onClick( function () {

        if( editor.emotionCMDManager.currentNodeSession!==null && editor.emotionCMDManager.currentNodeSession.triggerNode!==null ) {
            if( editor.currentEditedKey===editor.emotionCMDManager.currentNodeSession.triggerNode.key.getArg() ) {
                editor.emotionCMDManager.save();
                container.setDisplay( 'none' );
                return;
            }
        }

        if (confirm('Save the emotion command?')) {
            editor.emotionCMDManager.save();
        } else {
            // Do nothing!
        }

        container.setDisplay( 'none' );

    } );
    header.add( close );

    var canvas_out = new UI.Canvas();
    canvas_out.setId('n_e');
    container.add(canvas_out);

    $(function () {
        console.log($('#mainview')[0].offsetWidth);
        console.log($('#mainview')[0].offsetHeight);
        canvas_out.dom.width = $('#mainview')[0].offsetWidth;
        canvas_out.dom.height = $('#mainview')[0].offsetHeight;
        canvas_out.dom.style.width = $('#mainview')[0].offsetWidth + 'px';
        canvas_out.dom.style.height = $('#mainview')[0].offsetHeight + 'px';

        var graph = new LGraph();

        var canvas = new LGraphCanvas("#n_e", graph);

        var node_const = LiteGraph.createNode("basic/const");
        node_const.pos = [200,200];
        graph.add(node_const);
        node_const.setValue(4.5);

        var node_watch = LiteGraph.createNode("basic/watch");
        node_watch.pos = [700,200];
        graph.add(node_watch);

        node_const.connect(0, node_watch, 0 );

        graph.start();
    });

    return container;
};
