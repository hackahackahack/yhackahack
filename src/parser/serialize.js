import _ from 'lodash';

import handleExpression from './expression';

function basicToken(token, tag) {
    return { type: tag, attrs: _.fromPairs(token.attrs), children: [token.content] };
}

const rules = {
    code_inline(tokens, idx, options, env, variables) {
        return basicToken(tokens[idx], code);
    },

    code_block(tokens, idx, options, env, variables) {
        const token = tokens[idx];
        return { type: 'pre', attrs: _.fromPairs(token.attrs), children: { type: 'code', children: [token.content] } };
    },

    fence(tokens, idx, options, env, variables) {
        const token = tokens[idx];
        const info = token.info ? token.info.trim() : '';
        const langName = info ? info.split(/s+/g)[0] : '';

        // TODO: support syntax highlighting (maybe @html block)
        const attrs = _.fromPairs(token.attrs);
        if (info) {
            if (attrs.class) {
                attrs['class'] += options.langPrefix + langName;
            } else {
                attrs['class'] = options.langPrefix + langName;
            }
        }

        return { type: 'pre', attrs, children: { type: 'code', children: [token.content] } };
    },

    image(tokens, idx, options, env, variables) {
        return basicToken(tokens[idx], 'img');
    },

    hardbreak(tokens, idx, options, env, variables) {
        return { type: 'br' };
    },

    softbreak(tokens, idx, options, env, variables) {
        return { type: 'br' };
    },

    text(tokens, idx, options, env, variables) {
        return tokens[idx].content;
    },

    html_block(tokens, idx, options, env, variables) {
        return { type: '@html', value: tokens[idx].content };
    },

    html_inline(tokens, idx, options, env, variables) {
        return { type: '@html', value: tokens[idx].content };
    },

    variable_inline(tokens, idx, options, env, variables) {
        const varName = handleExpression(tokens[idx].content, variables);
        return { type: '@ref', var: varName };
    }
}

export default function serialize(tokens, options, env, variables) {
    let stack = [{ children: [] }];
    const len = tokens.length;

    let inLi = false;

    for (let i = 0; i < len; i++) {
        const type = tokens[i].type;
        const nesting = tokens[i].nesting;

        if (type === 'inline') {
            _.last(stack).children = serialize(tokens[i].children, options, env, variables).children;
        } else if (typeof rules[type] !== 'undefined') {
            _.last(stack).children.push(rules[type](tokens, i, options, env, variables));
        } else if (nesting === 1) { // start tag
            stack.push({ type: tokens[i].tag, attrs: _.fromPairs(tokens[i].attrs), children: [] });
        } else if (nesting === -1) { // end tag
            const closing = stack.pop();
            _.last(stack).children.push(closing);
        } else if (nesting === 0) { // self-closing tag
            _.last(stack).children.push({ type: tokens[i].tag, attrs: _.fromPairs(tokens[i].attrs), children: [tokens[i].content] });
        }
    }

    return _.last(stack);
}
