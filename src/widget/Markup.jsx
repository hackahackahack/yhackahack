import React from 'react';
import _ from 'lodash';

import Variable from './Variable';

/*
 * turns JSON tree into react elements (recursively)
 *
 */
function hydrate(astNode) {
    if (_.isString(astNode)) {
        return astNode;
    }

    if (!astNode.type.startsWith('@')) { // an HTML thingy (normal stuff)
        return React.createElement(astNode.type, {
            ..._.omit(astNode.attrs, 'class'),
            key: JSON.stringify(astNode),
            className: _.get(astNode, 'attrs.class')
        }, astNode.children ? astNode.children.map(hydrate) : undefined);
    } else if(astNode.type === '@html') {
        return <div dangerouslySetInnerHTML={{ __html: astNode.value }} />
    } else { // special things (aka the point)
        return <Variable name={astNode.var} key={astNode.var} />
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
