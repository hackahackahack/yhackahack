import MarkdownIt from 'markdown-it';

import syntaxPlugin from './syntax';
import serialize from './serialize';

export default class Parser {
    constructor() {
        this.md = new MarkdownIt('commonmark').use(syntaxPlugin);
    }

    parse(source) {
        const env = {};
        const variables = { inputs: {}, outputs: {} };
        const tokens = this.md.parse(source, env);
        console.log('Tokens', tokens);
        console.log('env', env);
        const ast = serialize(tokens, this.md.options, env, variables);
        console.log('Ast', ast);
        return { ast, variables };
    }
}
