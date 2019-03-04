"use strict";

class EmotionCMD {
	constructor(config){
		config = config || null;
		this.graph = new LGraph(config);
	}
	start(){
		this.graph.start();
	}
	stop(){
		this.graph.stop();
	}
	add(node){
		this.graph.add(node);
	}
	getGraph(){
		return this.graph;
	}
	getKey(){
		let trigger_nodes = this.graph.findNodesByTitle('Trigger Node');
		if(trigger_nodes.length!=1)
			alert('Graph error!');
		return trigger_nodes[0].properties['key'];
	}
	getInfo(){
		let trigger_nodes = this.graph.findNodesByTitle('Trigger Node');
		if(trigger_nodes.length!=1)
			alert('Graph error!');
		return trigger_nodes[0].properties;
	}
	setEditor(editor){ // set all nodes that need editor
		let trigger_nodes = this.graph.findNodesByTitle('Trigger Node');
		if(trigger_nodes.length!=1)
			alert('Graph error!');
		trigger_nodes[0].setEditor(editor);

		let face_nodes = this.graph.findNodesByTitle('Face Node');
		for(let k=0; k<face_nodes.length; ++k)
			face_nodes[k].setEditor(editor);
	}
}

class EmotionCMDManager {
	constructor (editor) {
		this.current_key = null;

		this.current_emotion_cmd = null;
		this.current_emotion_canvas = null;

		this.all_emotion_cmds = {};

		this.editor = editor;
	}

	stop(){
		for(let prop in this.all_emotion_cmds){
			this.all_emotion_cmds[prop].stop();
		}
	}

	save (cmd) {
		let trigger_nodes = cmd.getGraph().findNodesByTitle('Trigger Node');
		if(trigger_nodes.length!=1)
			alert('Emotion editing error! Only one trigger node is allowed!');
		else{
			let key_val = trigger_nodes[0].properties['key'];
			this.all_emotion_cmds[key_val] = cmd;
		}
	}

	toJSON () {
		let cmd_objs = {};
		for (let prop in this.all_emotion_cmds){
			let cmd = this.all_emotion_cmds[prop];
			let text_graph = cmd.getGraph().serialize();
			let keyboard_val = cmd.getKey();
			if(keyboard_val>='a'&&keyboard_val<='z' || keyboard_val>='a'&&keyboard_val<='z')
			cmd_objs[keyboard_val] = text_graph;
		}
		return cmd_objs;
	}

	fromJSON ( currentState ) {
		this.all_emotion_cmds = {};
		for ( let prop in currentState ) {
			let graph = currentState[prop];
			let emotion_cmd = new EmotionCMD(graph);
			emotion_cmd.setEditor(this.editor);
			this.all_emotion_cmds[prop] = emotion_cmd;
			emotion_cmd.start();
		}
	}
}
