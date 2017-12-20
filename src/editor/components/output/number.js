import textInput from '../../controls/text-input';
import sockets from '../../sockets';
import { moduleManager } from '../../module';
import * as D3NE from "d3-node-editor";

export default new D3NE.Component('Output number', {
    builder(node) {
        var inp = new D3NE.Input('Number', sockets.num);
        var ctrl = textInput('name', 'Name');

        return node
            .addControl(ctrl)
            .addInput(inp);
    },
    worker: moduleManager.workerOutputs.bind(moduleManager)
});
