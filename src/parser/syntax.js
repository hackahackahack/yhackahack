// https://github.com/markdown-it/markdown-it/blob/e6f19eab4204122e85e4a342e0c1c8486ff40c2d/lib/rules_inline/link.js
function variableTokenize(state, silent) {
    const ch = state.src.charCodeAt(state.pos);
    let pos = state.pos;

    if (ch !== 0x7B /* { */) {
        return false;
    }

    const start = pos + 1;
    const max = state.posMax;

    while (pos < max && state.src.charCodeAt(pos) !== 0x7D /* } */) {
        pos++;
    }

    const end = pos;

    if (!silent) {
        const token = state.push('variable_inline', 'var', 0);
        token.markup = '{';
        token.content = state.src.slice(start, end).replace(/[ \n]+/g, ' ').trim();
    }

    state.pos = end + 1;
    return true;
}

export default function variablePlugin(md) {
    md.inline.ruler.before('emphasis', 'variable_inline', variableTokenize);
    md.renderer.rules.variable_inline = (tokens, idx, options, env, slf) => {
        const token = tokens[idx];
        return '<magic-variable>' + tokens[idx].content + '</magic-variable>';
    };
}
