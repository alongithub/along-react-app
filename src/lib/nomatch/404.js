import React from 'react';
import './style.less';
import notFound from './images/404.png';

export default class NoMatch extends React.Component {
    state = {
        time: 3,
    };

    componentDidMount() {
        this.timer = setInterval(this.countdown, 1000);
    }

    countdown = () => {
        const {time} = this.state;
        const {history} = this.props;
        if (time <= 0) {
            clearInterval(this.timer);
            history.goBack();
        } else {
            this.setState({
                time: time - 1,
            });
        }
    };

    render() {
        const {time} = this.state;
        return (
            <div className="noMatch">
                <img src={notFound} alt=""/>
                <div>
                    <p>页面丢失了，请进行其他操作</p>
                    <p>{time}秒后返回上一级</p>
                </div>
            </div>
        );
    }
}
