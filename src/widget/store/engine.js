import math from 'mathjs';

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

    recomputeDependents(changedVar, state) {
        const newValues = {};
        for (let varName of Object.keys(state.variables.outputs)) {
            const definition = state.variables.outputs[varName];
            if (definition.dependencies.includes(changedVar)) {
                newValues[varName] = this.outputExpressions[varName].eval(state.values);
            }
        }

        return newValues;
    }
}
