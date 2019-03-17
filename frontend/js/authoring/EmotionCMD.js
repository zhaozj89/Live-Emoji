"use strict";

class EmotionCMD {
	constructor(config){
		this.name = '';
		this.note = '';
		this.shortcut = [];
		config = config || null;
		this.graph = new LGraph(config);
	}
	start(){
		this.graph.start(TIME_STEP+10);
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

	setNote(note){
		this.note = note;
	}
	getNote(){
		return this.note;
	}

	setUUID(uuid){
		this.uuid = uuid;
	}
	getUUID(){
		return this.uuid;
	}

	setShortcut(score){
		this.shortcut = score;
	}
	getShortcut(){
		return this.shortcut;
	}

	toJSON(){
		return {
			uuid: this.uuid,
			name: this.name,
			shortcut: this.shortcut,
			note: this.note,
			graph: this.graph.serialize()
		}
	}

	fromJSON(state){
		this.uuid = state.uuid;
		this.name = state.name;
		this.shortcut = state.shortcut;
		this.note = state.note;
		this.graph.configure(state.graph);
	}
}

class EmotionCMDManager {
	constructor (editor) {
		this.current_key = null;
		this.current_mouse = null;

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

	save (uuid, cmd) {
		this.all_emotion_cmds[uuid] = cmd;
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
