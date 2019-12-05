// 参数
// 后端返回的时间格式 必须规范 比如 2018-03-04 不能是2018-3-4 ，否则ie下需要处理一下数据
// custom : {
//      format: 'YYYY-MM-DD', //提交时返回的格式
// }
//
// props : {}; AntD Uoload 的配置参数
// options: {
//      initialValue: '2018-03-02',
// },


import React, {Component} from 'react';
import {DatePicker} from "antd";
import moment from 'moment';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';

class ADatePicker extends Component {
    state = {
        value: '',
    };

    componentDidMount() {
        this.props.onRef( this.props.name, this.getValue, this.reset, this.check);
        const {initValue} = this.props;
        this.setState({
            value: initValue ? moment(initValue) : null,
        })
    }

    check = () => {
        const {value} = this.state;
        return !!value;
    };

    componentWillReceiveProps(nextProps) {
        const state = {};
        if (nextProps.initValue && (nextProps.initValue !== this.props.initValue)) {
            state.value = moment(new Date(nextProps.initValue));
            this.setState(state);
        }
    }

    getValue = () => {
        const {name, custom} = this.props;
        const {format = 'YYYY-MM-DD'} = custom;
        return {[name]: this.state.value ? this.state.value.format(format) : ''};
    };

    reset = () => {

        const {initValue} = this.props;
        const state = {value: null};
        if (initValue) {
            state.value = moment(new Date(initValue));
            this.setState(state);
        } else {
            this.setState(state);
        }
    };

    handleChange = (a) => {
        const {changeCheck} = this.props;
        this.setState({
            value: a,
        },() => {
            changeCheck();
        });

    };

    render() {
        const {value} = this.state;
        const {antprops = {}} = this.props;
        const props = {};
        if (value !== '') {
            props.value = value;
        }
        return (
            <div>
                <LocaleProvider locale={zh_CN}>
                    <DatePicker {...props} {...antprops} onChange={this.handleChange}/>
                </LocaleProvider>
            </div>
        );
    }
}

export default ADatePicker;
