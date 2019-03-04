SidebarLeft.EmotionCMD = function (editor) {

    let signals = editor.signals;

    let container = new UI.Panel();

    let clients = [
        { "Name": "Otto Clay", "Match": 25 },
        { "Name": "Connor Johnston", "Match": 45 },
        { "Name": "Lacey Hess", "Match": 29 },
        { "Name": "Timothy Henson", "Match": 56},
        { "Name": "Ramona Benton", "Match": 32 }
    ];

    $(container.dom).jsGrid({
        width: "100%",
        height: "400px",

        inserting: true,
        editing: true,
        sorting: true,
        paging: true,

        data: clients,

        fields: [
            { name: "Name", type: "text", width: 150, validate: "required" },
            { name: "Match", type: "number", width: 50 },
            { type: "control" }
        ]
    });

    signals.saveEmotionCMD.add(function (info) {
        $(container.dom).jsGrid("insertItem", { Name: info.uuid, Age: info.match_score}).done(function() {
        });
    });

    return container;

};
