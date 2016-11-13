import React from 'react';
import { Provider } from 'react-redux';

import Markup from './Markup';

export default class Widget extends React.Component {
    getChildContext() {
        return { widgetId: this.props.id };
    }

    render() {
        const { source, store, id } = this.props;
        const { ast, variables } = source;
        return (
            <Provider store={store}>
                <div className="container-fluid">
                    <div className="col-md-8 col-md-offset-2">
                        <Markup ast={ast} widgetId={id} />
                    </div>
                </div>
            </Provider>
        );
    }
}

Widget.propTypes = {
    id: React.PropTypes.string.isRequired,
    source: React.PropTypes.any.isRequired,
    store: React.PropTypes.object.isRequired,
};

Widget.childContextTypes = {
    widgetId: React.PropTypes.string,
};
