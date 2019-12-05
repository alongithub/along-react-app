import React, {Component} from 'react';

class Test extends Component {
    componentDidMount() {
        this.props.onRef(this.props.name, this.getValue, this.reset, this.check);
    }

    getValue = () => {
        const {name} = this.props;
        return {[name]: 1};
    };

    check = () => {
    };

    reset = () => {
        console.log('Test 重置');
    };

    render() {
        const {text} = this.props;
        return <div>{text}</div>
    }
}

export default Test;
