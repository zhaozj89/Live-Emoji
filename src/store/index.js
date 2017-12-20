import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        editorIdentifier: 'animation_editor@1.0.0',
        textureSize: 1024,
        geometry: null,
        maps: [],
        texture: {
            el: null,
            src: null
        },
        previewControls: []
    },
    getters: {
        geometry(state) {
            return state.geometry;
        },
        maps(state) {
            return state.maps;
        },
        texture(state) {
            return state.texture;
        },
        textureSize(state) {
            return state.textureSize;
        }
    },
    mutations: {
        registerPreviewControl(state, {id, control}) {
            state.previewControls[id] = control;
        },
        updatePreviewControl(state, { id, canvas }) {
            if (state.previewControls[id]) // check if control exist in editor
                state.previewControls[id].updatePreview(canvas);
        },
        setGeometry(state, geometry) {
            state.geometry = geometry;
        },
        setTextureSize(state, size) {
            state.textureSize = size;
        },
        updateMaterial(state, maps) {
            state.maps = maps;
        },
        updateTexture(state, texture) {
            state.texture = texture;
        }
    }
});
