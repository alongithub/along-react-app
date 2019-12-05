import React, {Component} from 'react';
import {DatePicker} from "antd";
import moment from 'moment';

class AInlineDatePicker extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        this.props.onRef(this.props.name, this.getValue, this.reset, this.check);
        const {initValue, name} = this.props;
        const state = {};
        name.forEach((n, i) => {
            state[n] = initValue[i] ? initValue[i] : undefined;
        });
        this.setState(state);
    }

    componentWillReceiveProps(nextProps) {
        const state = {};
        const {name} = this.props;
        if (nextProps.initValue && (nextProps.initValue[0] !== this.props.initValue[0]) && (nextProps.initValue[0] !== this.props.initValue[0])) {
            name.forEach((n, i) => {
                state[n] = nextProps.initValue[i] ? nextProps.initValue[i] : undefined;
            });
            this.setState(state);
        }
    }

    check = () => {
        const {name} = this.props;
        for (let i = 0; i < name.length; i++) {
            if (!this.state[name[i]]) {
                return false
            }
        }
        return true;
    };

    getValue = () => {
        return this.state;
    };

    reset = () => {
        const state = {};
        const {name, initValue} = this.props;
        name.forEach((n, i) => {
            state[n] = initValue[i] ? initValue[i] : undefined;
        });
        this.setState(state);
    };

    onChange = key => (value) => {
        const {changeCheck} = this.props;
        this.setState({
            [key]: value ? value.format('YYYY-MM-DD') : undefined,
        },() => {
            changeCheck();
        });
    };

    render() {
        const {name} = this.props;
        const startTime = this.state[name[0]] ? this.state[name[0]] : undefined;
        const endTime = this.state[name[1]] ? this.state[name[1]] : undefined;
        return (
            <div style={{width: '100%'}}>
                <DatePicker placeholder="请选择开始时间" style={{width: 'calc(50% - 20px)'}} onChange={this.onChange(name[0])} value={startTime ? moment(startTime) : null}/>
                <span style={{display: 'inline-block', width: '40px', textAlign: 'center'}}>~</span>
                <DatePicker  placeholder="请选择结束时间" style={{width: 'calc(50% - 20px)'}} onChange={this.onChange(name[1])} value={endTime ? moment(endTime) : null}/>
            </div>
        )
    }
}

export default AInlineDatePicker;
