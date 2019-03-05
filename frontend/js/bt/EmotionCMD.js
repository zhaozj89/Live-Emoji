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
		this.name = null;
		this.match_score = 0;
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

	setName(name){
		this.name = name;
	}
	getName(){
		return this.name;
	}

	setMatchScore(score){
		this.match_score = score;
	}
	getMatchScore(){
		return this.match_score;
	}

	toJSON(){
		return {
			name: this.name,
			match_score: this.match_score,
			graph: this.graph.serialize()
		}
	}

	fromJSON(state){
		this.name = state.name;
		this.match_score = state.match_score;
		this.graph.configure(state.graph);
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

	start(){
		for(let prop in this.all_emotion_cmds){
			this.all_emotion_cmds[prop].start();
		}
	}

	save (cmd) {
		// _ComputeMatchScore();
		let uuid = _GenerateUUID();
		this.all_emotion_cmds[uuid] = cmd;
		return {match_score: 0, uuid: uuid, name: ""};
	}

	toJSON () {
		let cmd_objs = {};
		for (let prop in this.all_emotion_cmds){
			let cmd = this.all_emotion_cmds[prop];
			cmd_objs[prop] = cmd.toJSON();
		}
		return cmd_objs;
	}

	fromJSON ( currentState ) {
		this.all_emotion_cmds = {};
		for ( let prop in currentState ) {
			let emotion_cmd = new EmotionCMD();
			emotion_cmd.fromJSON(currentState[prop])
			this.all_emotion_cmds[prop] = emotion_cmd;
		}
	}
}
