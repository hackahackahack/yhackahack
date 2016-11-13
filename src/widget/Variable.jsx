import React from 'react';
import { connect } from 'react-redux';

import { selectValue } from './store/selectors';

class Variable extends React.Component {
    render() {
        return <span>{ this.props.value }</span>
    }
}

function mapStateToProps(state, ownProps) {
    return {
        value: selectValue(state, ownProps.widgetId, ownProps.name),
    };
}

Variable = connect(mapStateToProps)(Variable);

export default class VariableWrapper extends React.Component {
    render() {
        return <Variable widgetId={this.context.widgetId} {...this.props} />
    }
}

VariableWrapper.contextTypes = {
    widgetId: React.PropTypes.string,
};
