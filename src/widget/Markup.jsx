import React from 'react';
import _ from 'lodash';

function hydrate(astNode) {
    if (_.isString(astNode)) {
        return astNode;
    }

    if (!astNode.type.startsWith('@')) {
        return React.createElement(astNode.type, { ...astNode.attrs, key: JSON.stringify(astNode)}, astNode.children ? astNode.children.map(hydrate) : undefined);
    } else {
        return <code key={JSON.stringify(astNode)}>{JSON.stringify(astNode)}</code>
    }
}

export default function Markup({ ast, inline }) {
    const children = ast.children.map(hydrate);
    return React.createElement(inline ? 'span' : 'div', {}, children);
}

Markup.propTypes = {
    ast: React.PropTypes.object.isRequired,
    inline: React.PropTypes.bool,
};
