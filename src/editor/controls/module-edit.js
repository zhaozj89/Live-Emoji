import eventbus from '../../eventbus';
import * as D3NE from "d3-node-editor";

export default function (module) {
    return new D3NE.Control('<div class="module-control"><input readonly type="text"><button>Edit</button></div>', (el, control) => {

        el.querySelector('input').value = module.name;
        el.querySelector('button').onmousedown = () => {
            eventbus.$emit('openmodule', module);
        };
    });
}
