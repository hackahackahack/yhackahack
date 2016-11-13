import React from 'react';
import { connect } from 'react-redux';
import Tether from 'tether';

import { selectValue, isOutputVariable } from './store/selectors';
import { setVariable } from './store/actions';
import OutputVariable from './OutputVariable';

import './Variable.scss';

class Variable extends React.Component {
    constructor() {
        super();
        this.state = {
            status: "inactive",
            x: null,
            y: null,
        }
    }

    componentDidMount() {
        if (!!this.elt) {
            this.tether = new Tether({
                element: this.valContainer,
                target: this.elt,
                attachment: 'middle left',
                offset: '0 -800px',
                constraints: [
                    { to: 'scrollParent', pin: true }
                ]
            });
        }
    }

    componentWillUnmount() {
        if (!!this.tether) {
            this.tether.destroy();
        }
    }

    handleMouseEnter() { // when hovered
        this.setState({status: "ready"});
    }
    handleMouseDown(e) { //
        this.setState({status: "active"});
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
            this.props.setVariable(value);
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
            return <span>
                <span className='InputVariable-value' onMouseEnter = {this.handleMouseEnter.bind(this)}
                    onMouseDown = {this.handleMouseDown.bind(this)}
                    onMouseUp = {this.handleMouseUp.bind(this)}
                    onMouseLeave = {this.handleMouseLeave.bind(this)}
                    onMouseMove = {this.handleMouseMove.bind(this)}
                    ref={(elt) => this.elt = elt}
                    >
                        { this.props.value }
                    </span>
                    <span ref={(elt) => this.valContainer = elt} className='InputVariable-name'>{ this.props.name }</span>
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
