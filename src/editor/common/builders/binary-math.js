import modifyMath from './math';
import sockets from '../../sockets';
import * as D3NE from "d3-node-editor";

export default function (node) {
    modifyMath(node);
    var inp = new D3NE.Input('Value', sockets.value);

    return node.addInput(inp);
}
