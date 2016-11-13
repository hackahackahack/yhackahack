import _ from 'lodash';

export function selectValue(state, widgetId, name) {
    return state[widgetId].values[name];
}

export function isInputVariable(state, widgetId, name) {
    return _.has(state[widgetId].variables.inputs, name);
}

export function isOutputVariable(state, widgetId, name) {
    return _.has(state[widgetId].variables.outputs, name);
}

export function selectDefinition(state, widgetId, name) {
    return state[widgetId].variables.outputs[name] || state[widgetId].variables.inputs[name];
}

export function selectTex(state, widgetId, name) {
    return state[widgetId].tex[name];
}
