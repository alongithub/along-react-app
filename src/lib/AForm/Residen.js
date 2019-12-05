import React, {Component} from 'react';
import {InputNumber} from 'antd';

class Residen extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        this.props.onRef(this.props.name, this.getValue, this.reset, this.check);
        const {initValue, name} = this.props;
        const state = {};
        name.forEach((n, i) => {
            state[n] = initValue[i] ? initValue[i] : 0;
        });
        this.setState(state);
    }

    componentWillReceiveProps(nextProps) {
        const state = {};
        const {name} = this.props;
        if (nextProps.initValue && (nextProps.initValue[0] !== this.props.initValue[0]) && (nextProps.initValue[0] !== this.props.initValue[0])) {
            name.forEach((n, i) => {
                state[n] = nextProps.initValue[i] ? nextProps.initValue[i] : 0;
            });
            this.setState(state);
        }
    }

    check = () => {
        const {name} = this.props;
        name.forEach(n => {
            if (!this.state[n]) return false;
        })
        return true;
    };

    getValue = () => {
        return this.state;
    };

    reset = () => {
        const state = {};
        const {name, initValue} = this.props;
        name.forEach((n, i) => {
            state[n] = initValue[i] ? initValue[i] : 0;
        });
        this.setState(state);
    };

    onChange = key => (value) => {
        const {changeCheck} = this.props;
        if (parseInt(value, 10) || parseInt(value, 10) === 0) {
            this.setState({
                [key]: parseInt(value, 10),
            }, () => {
                changeCheck();
            });
        }
    };

    render() {
        const {name} = this.props;
        return (
            <div>
                <InputNumber min={0} value={this.state[name[0]]} onChange={this.onChange(name[0])}/>
                <span style={{padding: '0 20px'}}>分</span>
                <InputNumber min={0} value={this.state[name[1]]} onChange={this.onChange(name[1])}/>
                <span style={{padding: '0 20px'}}>米</span>
            </div>
        )
    }
}

export default Residen;
