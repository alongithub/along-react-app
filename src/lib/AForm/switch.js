import React, {Component} from 'react';
import {Switch} from 'antd';

class Switchs extends Component {
    state = {
        finger: true,
        face: true,
    };

    componentDidMount() {
        this.props.onRef(this.props.name, this.getValue, this.reset, this.check);
    }

    getValue = () => {
        const {name} = this.props;
        const {finger, face} = this.state;
        return {
            [name]: {
                finger,
                face,
            }
        };
    };

    check = () => {
    };

    reset = () => {
        console.log('Test 重置');
    };

    render() {
        const tipstyle = {fontSize: '12px', marginLeft: '10px'};
        const {finger, face} = this.state;
        return <div>
            <span style={tipstyle}>验证指纹：</span>
            <Switch checked={finger} onChange={(value) => {this.setState({finger: value})}} size="small"/>,
            <span style={tipstyle}>验证人脸：</span>
            <Switch checked={face} onChange={(value) => {this.setState({face: value})}} size="small"/>,
        </div>
    }
}

export default Switchs;
