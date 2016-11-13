import math from 'mathjs';
import { parse } from './variable.pegjs';

function extractDependencies(expr) {
    return math.parse(expr).filter((node) => node.isSymbolNode).map((node) => node.name);
}

export default function handleExpression(expr, variables) {
    const parsed = parse(expr);
    if (parsed.is === 'input') {
        variables.inputs[parsed.name] = { range: parsed.range, initial: parsed.initial };
    } else if (parsed.is === 'output') {
        const dependencies = extractDependencies(parsed.expr);
        variables.outputs[parsed.name] = { expression: parsed.expr, dependencies };
    }

    return parsed.name;
}
