import React from 'react';
import { Provider } from 'react-redux';

import Markup from './Markup';

export default class Widget extends React.Component {
    render() {
        const {source, store} = this.props;
        const [ast, variables] = source;
        return (
            <Provider store={store}>
                <Markup ast={ast} />
            </Provider>
        );
    }
}

Widget.propTypes = {
    source: React.PropTypes.any.isRequired,
    store: React.PropTypes.object.isRequired,
};
