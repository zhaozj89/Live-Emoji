SidebarLeft.EmotionCMD = function (editor) {

    let signals = editor.signals;

    let container = new UI.Panel();

    let clients = [
        {"Name": "Otto Clay", "Note": "test", "uuid": "32432"},
    ];

    $(container.dom).jsGrid({
        width: "100%",
        height: "100%",

        // filtering: true,
        editing: true,
        // inserting: true,
        sorting: true,
        paging: true,
        autoload: true,

        onItemEditing: function (args) {
            if (editor.emotionCMDManager.all_emotion_cmds.hasOwnProperty(args.item.uuid)) {
                let emotion_cmd = editor.emotionCMDManager.all_emotion_cmds[args.item.uuid];

                // edit graph
                $('#editor_canvas').remove();
                CreateNECanvas(editor);
                ResizeNECanvas(editor);

                let emotion_canvas = new LGraphCanvas("#editor_canvas", emotion_cmd.getGraph());
                for (let i = 0; i < emotion_cmd.getGraph()._nodes.length; ++i) {
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
                emotion_cmd.start();
            }
        },

        onItemUpdated: function (args) {
            if (editor.emotionCMDManager.all_emotion_cmds.hasOwnProperty(args.item.uuid)) {
                let emotion_cmd = editor.emotionCMDManager.all_emotion_cmds[args.item.uuid];
                emotion_cmd.setName(args.item.Name);
                emotion_cmd.setNote(args.item.Note);
                SaveAEmotionCMD(emotion_cmd);
            }
        },

        onItemDeleted: function (args) {
            if (editor.emotionCMDManager.all_emotion_cmds.hasOwnProperty(args.item.uuid)) {
                delete editor.emotionCMDManager.all_emotion_cmds[args.item.uuid];
            }
        },

        data: clients,

        deleteConfirm: "Do you really want to delete the client?",

        fields: [
            {name: "Name", type: "text", width: 120},
            {name: "Note", type: "text", width: 80},
            {name: "uuid", type: "text", visible: false},
            {type: "control", modeSwitchButton: false, editButton: false,
                headerTemplate: function() {
                    return $("<button>").text("Add").css('background', '#393939')
                        .on("click", function () {
                            RenewAGraph();
                        });
                }
            }
        ]
    });

    signals.saveEmotionCMD.add(function (info) {
        $(container.dom).jsGrid("insertItem", {
            Name: info.name,
            Note: info.note,
            uuid: info.uuid
        }).done(function () {
        });
    });

    return container;

};
