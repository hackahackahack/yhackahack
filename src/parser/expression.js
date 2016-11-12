import math from 'math';

const wordExpr = r//;

function extractDependencies(expr) {
    return math.parse(expr).filter((node) => node.isSymbolNode).map((node) => node.name);
}

function declareVariable(expr, variables) {
    const firstWord =
}
