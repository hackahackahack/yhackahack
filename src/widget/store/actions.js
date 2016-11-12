export const ADD_WIDGET = 'add-widget';
export const SET_VARIABLE = 'set-variable';

export function addWidget(widgetId, variables) {
    return { type: ADD_WIDGET, widgetId, variables };
}

export function setVariable(widgetId, name, value) {
    return { type: SET_VARIABLE, widgetId, name, value };
}
