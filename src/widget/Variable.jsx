import React from 'react';
import { connect } from 'react-redux';

import { selectValue } from './store/selectors';
import { setVariable } from './store/actions';

class Variable extends React.Component {
    constructor() { 
        this.state = {
            status: "inactive";
            x: null; 
            y: null; 
        }
    }
    handleMouseEnter(event) { // when hovered 
        this.setState({status: "ready"}); 
    } 
    handleMouseDown(event) { // 
        this.setState({status: "active"}); 
        var e = window.event;
        this.setState({x: e.clientX}); 
        this.setState({y: e.clientY}); 
        
    }
    handleMouseMove(event) { 
        if (this.state.status == "active") {
            var newx = event.clientX; 
            var value = this.props.value + (newx - this.state.x); 
            this.props.setVariable({value: value}); 
        }
    }
    handleMouseUp(event) { // 
        this.setState({status: "inactive"});
    }
    handleMouseLeave(event) { 
        if (this.state.status == "ready") {
            this.setState({status: "inactive"}); 
        }      
    }

    render() {
        return <span onMouseEnter = {handleMouseEnter(event)} 
                onMouseDown = {handleMouseDown(event)}
                onMouseUp = {handleMouseUp(event)}
                onMouseLeave = {handleMouseLeave(event)} 
                onMouseMove = {handleMouseMove(event)}>
                    { this.props.value }
                </span>
    }

}

function mapStateToProps(state, ownProps) {
    return {
        value: selectValue(state, ownProps.widgetId, ownProps.name),
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
