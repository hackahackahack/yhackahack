import math from 'mathjs';
import _ from 'lodash';

export default class Engine {
    constructor() {
        this.outputExpressions = {};
    }

    registerOutput(varName, expr) {
        this.outputExpressions[varName] = math.compile(expr);
    }

    registerOutputs(state) {
        for (let varName of Object.keys(state.variables.outputs)) {
            this.registerOutput(varName, state.variables.outputs[varName].expression);
        }
    }

    computeInitialValues(state) {
        const initialValues = {};
        for (let varName of Object.keys(state.variables.inputs)) {
            initialValues[varName] = state.variables.inputs[varName].initial;
        }

        for (let varName of Object.keys(state.variables.outputs)) {
            initialValues[varName] = this.outputExpressions[varName].eval(initialValues);
        }

        return initialValues;
    }

    setValue(state, varName, varValue) {
        this.checkValue(varValue, state.variables.inputs[varName]);
        const newValues = _.assign({}, state.values, { [varName]: varValue });
        for (let calculatedVar of Object.keys(state.variables.outputs))
        {
            const defn = state.variables.outputs[calculatedVar];
            if (defn.dependencies.includes(varName)) {
                // possibly nondeterministic for calculated variables that depend on each other
                newValues[calculatedVar] = this.outputExpressions[calculatedVar].eval(newValues);
            }
        }

        return state.set('values', newValues);
    }

    checkValue(value, variableDef) {
        const type = variableDef.range.type;
        if (type === 'discrete' && !_.isInteger(value)) {
            throw new Error('Expected discrete value');
        } else if (type === 'continuous' && !_.isNumber(value)) {
            throw new Error('Expected continuous value');
        }
        // TODO: check categorical

        if (type === 'discrete' || type === 'continuous') {
            const min = variableDef.range.start;
            const max = variableDef.range.end;

            if (value < min) {
                throw new Error('Value too small');
            } else if (value > max) {
                throw new Error('Value too large');
            }
        }
    }
}
