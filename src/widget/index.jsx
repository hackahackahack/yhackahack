import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import _ from 'lodash';

import Widget from './Widget';
import Parser from '../parser';
import configureStore from './store';
import { addWidget, declareVariables } from './store/actions';

console.groupCollapsed('Locating glass elements');
let elements = Array.from(document.querySelectorAll('script[type="application/glass"]'), (elt) => {
    console.log('Found', elt);
    const parser = new Parser();

    const source = parser.parse(elt.textContent.trim()); // should be pre-parsed and JSON serialized?
    const container = document.createElement('div');
    const parent = elt.parentNode;
    parent.replaceChild(container, elt);
    return { container, source, id: _.uniqueId('widget-') };
});
console.groupEnd();

const store = configureStore();

for (let elt of elements) {
    store.dispatch(addWidget(elt.id, elt.source.variables));
}

function renderWidget({ container, source, id }) {
    ReactDOM.render(<AppContainer><Widget id={id} source={source} store={store} /></AppContainer>, container);
}

function renderApp() {
    elements.forEach(renderWidget);
}

renderApp();

if (module.hot) {
    module.hot.accept('./Widget', renderApp);
}
