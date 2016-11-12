import React from 'react';
import { Provider } from 'react-redux';

export default class Widget extends React.Component {
    render() {
        const {source, store} = this.props;
        return (
            <Provider store={store}>
                <pre>{source}</pre>
            </Provider>
        );
    }
}

Widget.propTypes = {
    source: React.PropTypes.string.isRequired,
    store: React.PropTypes.object.isRequired,
};
