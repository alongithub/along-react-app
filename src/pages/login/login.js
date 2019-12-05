import React from 'react';

const Login = ({history}) => {
    const log = () => {
        history.push('/along/pickup');
    };

    return (
        <div style={{textAlign: 'center'}}>
            <p
                style={{
                    lineHeight: '100vh', color: '#328eeb', textDecoration: 'underline', cursor: 'pointer',
                }}
                onClick={log}
            >
                点击任意位置，进入 along-react-app
            </p>
        </div>
    );
};

export default Login;
