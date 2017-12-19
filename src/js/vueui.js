export var createVueUI = function(){
    var app1 = new Vue({
        el: '#package',
        data: {
            btns: [
                { text: 'emotion' },
                { text: 'secondary motion' },
                { text: 'artwork swap' },
                { text: 'background motion' }
            ]
        }
    })
}