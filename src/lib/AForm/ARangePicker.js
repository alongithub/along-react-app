// 暂时不能用

import React, {Component} from 'react';
import moment from 'moment';
import { LocaleProvider, DatePicker, } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';

const RangePicker = DatePicker.RangePicker;

class ARangePicker extends Component {
    state = {
        value: '',
    };

    componentDidMount() {
        this.props.onRef(this.getValue, this.reset, this.props.name);
        const {initValue} = this.props;
        this.setState({
            value: initValue,
        })
    }

    componentWillReceiveProps(nextProps) {
        const state = {};
        if (nextProps.initValue && (nextProps.initValue !== this.props.initValue)) {
            state.value = nextProps.initValue;
            this.setState(state);
        }
    }

    getValue = () => {
        const {name} = this.props;
        return {[name]: this.state.value};
    };

    reset = () => {
        const {initValue} = this.props;
        const state = {value: ''};
        if (initValue) {
            state.value = initValue;
            this.setState(state);
        } else {
            this.setState(state);
        }
    };

    handleChange = (a) => {
        this.setState({
            value: a,
        })
    };

    render() {
        const {value} = this.state;
        const {placeholder} = this.props;
        const props = {};
        if (value !== '') {
            props.value = value;
        }
        return (
            <div>
                <LocaleProvider locale={zh_CN}>
                    <RangePicker placeholder={placeholder} {...props} onChange={this.handleChange}/>
                </LocaleProvider>
            </div>
        );
    }
}

export default ARangePicker;
