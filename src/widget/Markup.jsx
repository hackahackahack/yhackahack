import React from 'react';
import _ from 'lodash';

/* 
 * turns JSON tree into react elements (recursively)
 * 
 */ 
function hydrate(astNode) {
    if (_.isString(astNode)) {
        return astNode;
    }

    if (!astNode.type.startsWith('@')) { // an HTML thingy (normal stuff)
        return React.createElement(astNode.type, { ...astNode.attrs, key: JSON.stringify(astNode)}, astNode.children ? astNode.children.map(hydrate) : undefined);
    } else { // special things (aka the point)
        return <code key={JSON.stringify(astNode)}>{JSON.stringify(astNode)}</code>
        // TODO: handle variables and dependent 
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
