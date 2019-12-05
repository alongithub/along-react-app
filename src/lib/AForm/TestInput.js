import React, {Component} from 'react';
import {Input} from 'antd';

class TestInput extends Component {
    state = {
        input: '',
    };
    componentDidMount() {
        this.props.onRef(this.props.name, this.getValue, this.reset, this.check);
    }
    getValue = () => {
        const {name} = this.props;
        return {[name]: this.state.input};
    };

    check = () => {
    };

    reset = () => {
        this.setState({
            input: '',
        })
    };

    render() {
        const {input} = this.state;
        return (
            <div>
                <Input value={input} onChange={(e) => {
                    this.setState({input: e.target.value});
                }}/>
            </div>
        );
    }
}

export default TestInput;
