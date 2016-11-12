import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import Widget from './Widget';
import configureStore from './store';

console.groupCollapsed('Locating glass elements');
let elements = Array.from(document.querySelectorAll('script[type="application/glass"]'), (elt) => {
    console.log('Found', elt);
    const source = elt.textContent; // JSON deserialize? depends how we export
    const container = document.createElement('div');
    const parent = elt.parentNode;
    parent.replaceChild(container, elt);
    return { container, source };
});
console.groupEnd();

const store = configureStore();

function renderWidget({ container, source }) {
    ReactDOM.render(<AppContainer><Widget source={source} store={store} /></AppContainer>, container);
}

function renderApp() {
    elements.forEach(renderWidget);
}

renderApp();

if (module.hot) {
    module.hot.accept('./Widget', renderApp);
}
