import Immutable from 'seamless-immutable';
import _ from 'lodash';

import { SET_VARIABLE, DECLARE_VARIABLES, ADD_WIDGET } from './actions';
import Engine from './engine';

const initialState = Immutable({})

/*
 * Shape of state:
 *
 * for each widget:
 * values: {
 *    varName: varValue
 * },
 * variables: {
 *   same inputs/outputs as from tree
 * }
 */

 const engines = {}; // global state like this kinda super iffy

export default function reducer(state = initialState, action) {
    let engine;
    switch (action.type) {
        case ADD_WIDGET:
            engine = new Engine();
            engines[action.widgetId] = engine;
            const initial = { variables: action.variables };
            engine.registerOutputs(initial);
            initial.values = engine.computeInitialValues(initial);
            return state.set(action.widgetId, initial);
        case SET_VARIABLE:
            engine = engines[action.widgetId];
            const withNewValue = state.setIn([action.widgetId, 'values', action.name], action.value);
            const updatedValues = engine.recomputeDependents(action.name, withNewValue[action.widgetId]);
            return withNewValue.setIn([action.widgetId, 'values'], withNewValue[action.widgetId].values.merge(updatedValues));
        default:
            return state;
    }
}

/*
{
type: 'set-variable', widgetId: 'widget-1', name: 'cookies', value: 10
}
*/
