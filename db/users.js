var records = [
    {id: 1, username: 'guest', password: 'guest123', config: 'asset/test.json'},
    {id: 2, username: 'Antarctica', password: 'guest123', config: 'asset/story/Antarctica.json'},
    {id: 3, username: 'Earth', password: 'guest123', config: 'asset/story/Earth.json'},
    {id: 4, username: 'Everest', password: 'guest123', config: 'asset/story/Everest.json'},
    {id: 5, username: 'Itza', password: 'guest123', config: 'asset/story/Itza.json'},
    {id: 6, username: 'Jiuzhaigou', password: 'guest123', config: 'asset/story/Jiuzhaigou.json'},
    {id: 7, username: 'Petra', password: 'guest123', config: 'asset/story/Petra.json'},
    {id: 8, username: 'Solar', password: 'guest123', config: 'asset/story/Solar.json'},
    {id: 9, username: 'World', password: 'guest123', config: 'asset/story/World.json'}
];

exports.findById = function (id, cb) {
    process.nextTick(function () {
        var idx = id - 1;
        if (records[idx]) {
            cb(null, records[idx]);
        } else {
            cb(new Error('User ' + id + ' does not exist'));
        }
    });
}

exports.findByUsername = function (username, cb) {
    process.nextTick(function () {
        for (var i = 0, len = records.length; i < len; i++) {
            var record = records[i];
            if (record.username === username) {
                return cb(null, record);
            }
        }
        return cb(null, null);
    });
}
