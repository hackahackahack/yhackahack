import React from 'react';
import { connect } from 'react-redux';
import Tether from 'tether';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import './OutputVariable.scss';
import _ from 'lodash';

import { selectValue, selectTex } from './store/selectors';

class OutputVariable extends React.Component {
    constructor() {
        super();
        this.state = { showExpression: false };
    }

    componentDidMount() {
        const { expression } = this.props;
        katex.render(expression, this.exprContainer, { displayMode: true, throwOnError: false });

        this.tether = new Tether({
            element: this.exprContainer,
            target: this.elt,
            attachment: 'middle left',
            targetOffset: '0 400px',
            constraints: [
                { to: 'scrollParent', pin: true }
            ]
        });
    }

    componentWillUnmount() {
        if (!!this.tether) {
            this.tether.destroy();
        }
    }

    onEnter() {
        this.setState({ showExpression: true });
    }

    onLeave() {
        this.setState({ showExpression: false });
    }

    render() {
        const exprStyle = { display: this.state.showExpression || 'none'  };
        return (
            <span>
                <span className='OutputVariable-formula' style={exprStyle} ref={(elt) => this.exprContainer = elt}></span>
                <span
                    className='OutputVariable-value'
                    ref={(elt) => this.elt = elt}
                    onMouseEnter={this.onEnter.bind(this)}
                    onMouseLeave={this.onLeave.bind(this)}>
                    { _.isNumber(this.props.value) ? Math.floor(this.props.value) : this.props.value }
                </span>
            </span>
        );
    }
}

OutputVariable.propTypes = {
    widgetId: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    expression: React.PropTypes.string.isRequired,
    value: React.PropTypes.any.isRequired,
};

function mapStateToProps(state, ownProps) {
    return {
        expression: selectTex(state, ownProps.widgetId, ownProps.name),
        value: selectValue(state, ownProps.widgetId, ownProps.name),
    };
}

export default connect(mapStateToProps)(OutputVariable);
