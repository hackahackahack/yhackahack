import React from 'react';
import { connect } from 'react-redux';

import { selectValue, isOutputVariable } from './store/selectors';
import OutputVariable from './OutputVariable';

class Variable extends React.Component {
    constructor() { 
        this.state = {
            status: "inactive";
        }
    }
    handleMouseEnter() { // when hovered 
        this.setState({status: "ready"}); 
    } 
    handleMouseDown() { // 
        this.setState({status: "active"}); 
    }
    handleMouseUp() { // 
        this.setState({status: "inactive"});
    }
    handleMouseLeave() { 
        if (this.state.status == "ready") {
            this.setState({status: "inactive"}); 
        }      
    }

    render() {
        if (this.props.isOutput) {
            return <OutputVariable widgetId={this.props.widgetId} name={this.props.name} />;
        } else {
            return <span onMouseEnter = {handleMouseEnter()} 
                onMouseDown = {handleMouseDown()}
                onMouseUp = {handleMouseUp()}
                onMouseLeave = {handleMouseLeave()} >
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

Variable = connect(mapStateToProps)(Variable);

export default class VariableWrapper extends React.Component {
    render() {
        return <Variable widgetId={this.context.widgetId} {...this.props} />
    }
}

VariableWrapper.contextTypes = {
    widgetId: React.PropTypes.string,
};
