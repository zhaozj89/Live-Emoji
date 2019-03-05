SidebarLeft.EmotionCMD = function (editor) {

    let signals = editor.signals;

    let container = new UI.Panel();

    let clients = [
        { "Name": "Otto Clay", "Match": 25, "uuid": "32432" },
    ];

    $(container.dom).jsGrid({
        width: "100%",
        height: "400px",

        inserting: true,
        editing: true,
        sorting: true,
        paging: true,

        onItemEditing: function(args){
            if(editor.emotionCMDManager.all_emotion_cmds.hasOwnProperty(args.item.uuid)) {
                let emotion_cmd = editor.emotionCMDManager.all_emotion_cmds[args.item.uuid];

                // edit graph
                $('#editor_canvas').remove();
                CreateNECanvas(editor);
                ResizeNECanvas(editor);

                let emotion_canvas = new LGraphCanvas("#editor_canvas", emotion_cmd.getGraph());
                for(let i=0; i<emotion_cmd.getGraph()._nodes.length; ++i) {
                    let cur_node = emotion_cmd.getGraph()._nodes[i];
                    for (let prop in cur_node.properties) {
                        if (cur_node.widgets.length > 0) {
                            for (let j = 0; j < cur_node.widgets.length; ++j) {
                                if (cur_node.widgets[j].name == prop)
                                    cur_node.widgets[j].value = cur_node.properties[prop];
                            }
                        }
                    }
                }

                emotion_canvas.drawFrontCanvas();
                editor.emotionCMDManager.stop();
                editor.emotionCMDManager.current_emotion_cmd = emotion_cmd;
            }
        },

        onItemUpdated: function(args) {
            if(args.previousItem.Match!=args.item.Match){
                args.item.Match = args.previousItem.Match;
            }

            if(editor.emotionCMDManager.all_emotion_cmds.hasOwnProperty(args.item.uuid)){
                let emotion_cmd = editor.emotionCMDManager.all_emotion_cmds[args.item.uuid];
                emotion_cmd.setName( args.item.Name);
                emotion_cmd.setMatchScore( args.previousItem.Match);
            }
        },

        onItemDeleted: function(args) {
            if (editor.emotionCMDManager.all_emotion_cmds.hasOwnProperty(args.item.uuid)) {
                delete editor.emotionCMDManager.all_emotion_cmds[args.item.uuid];
            }
        },

        data: clients,

        fields: [
            { name: "Name", type: "text", width: 150, validate: "required" },
            { name: "Match", type: "number", width: 50 },
            { name: "uuid", type: "text", visible: false},
            { type: "control" }
        ]
    });

    signals.saveEmotionCMD.add(function (info) {
        $(container.dom).jsGrid("insertItem", { Name: info.name, Match: info.match_score,uuid: info.uuid}).done(function() {
        });
    });

    return container;

};
