export function selectValue(state, widgetId, name) {
    return state[widgetId].values[name];
}

export function isInputVariable(state, widgetId, name) {
    return state[widgetId].variables.inputs.includes(name);
}

export function isOutputVariable(state, widgetId, name) {
    return state[widgetId].variables.outputs.includes(name);
}
