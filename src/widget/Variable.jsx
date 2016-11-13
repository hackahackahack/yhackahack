import React from 'react';
import { connect } from 'react-redux';

import { selectValue, isOutputVariable } from './store/selectors';
import { setVariable } from './store/actions';
import OutputVariable from './OutputVariable';

class Variable extends React.Component {
    constructor() {
        super();
        this.state = {
            status: "inactive",
            x: null,
            y: null,
        }
    }

    handleMouseEnter() { // when hovered
        this.setState({status: "ready"});
    }
    handleMouseDown() { //
        this.setState({status: "active"});
        var e = window.event;
        this.setState({x: e.clientX});
        this.setState({y: e.clientY});
    }

    handleMouseUp() {
        this.setState({status: "inactive"});
    }

    handleMouseMove(event) {
        if (this.state.status == "active") {
            var newx = event.clientX;
            var value = this.props.value + (newx - this.state.x);
            this.props.setVariable({value: value});
        }
    }

    handleMouseLeave(event) {
        if (this.state.status == "ready") {
            this.setState({status: "inactive"});
        }
    }

    render() {

        if (this.props.isOutput) {
            return <OutputVariable widgetId={this.props.widgetId} name={this.props.name} />;
        } else {
            return <span onMouseEnter = {this.handleMouseEnter.bind(this)}
                onMouseDown = {this.handleMouseDown.bind(this)}
                onMouseUp = {this.handleMouseUp.bind(this)}
                onMouseLeave = {this.handleMouseLeave.bind(this)}
                onMouseMove = {this.handleMouseMove.bind(this)}>
                    { this.props.value }
                </span>;
		}
    }
}

function mapStateToProps(state, ownProps) {
    return {
        value: selectValue(state, ownProps.widgetId, ownProps.name),
        isOutput: isOutputVariable(state, ownProps.widgetId, ownProps.name),
    };
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        setVariable(value) {
            dispatch(setVariable(ownProps.widgetId, ownProps.name, value));
        }
    }
}

Variable = connect(mapStateToProps, mapDispatchToProps)(Variable);

export default class VariableWrapper extends React.Component {
    render() {
        return <Variable widgetId={this.context.widgetId} {...this.props} />
    }
}

VariableWrapper.contextTypes = {
    widgetId: React.PropTypes.string,
};
