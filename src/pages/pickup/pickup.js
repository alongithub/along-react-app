import React from 'react';
import panda from '@images/panda.jpg';
import {say} from '../commen/util';


say();
const Pickup = () => (
    <div style={{
        height: '100%', width: '100%', textAlign: 'center', background: '#fff',
    }}
    >
        <img src={panda} alt="panda"/>
    </div>
);

export default Pickup;