"use strict";

function _GenerateUUID()
{
	return uuidv5('http://example.com/hello', uuidv5.URL); // -> v5 UUID
}

function _ComputeMatchScore() {
	return 0;
}

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
		// _ComputeMatchScore();
		let uuid = _GenerateUUID();
		this.all_emotion_cmds[uuid] = cmd;
		return {match_score: 0, uuid: uuid};
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
			this.all_emotion_cmds[prop] = emotion_cmd;
		}
	}
}
