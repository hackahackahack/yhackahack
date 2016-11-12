import { createStore } from 'redux';

import reducer from './reducer';

export default function configureStore() {
    const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
    if (module.hot) {
        module.hot.accept('./reducer', () => store.replaceReducer(reducer));
    }
    return store;
}
