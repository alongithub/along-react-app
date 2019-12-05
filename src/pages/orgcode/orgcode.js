import React from 'react';
import FreeScrollBar from 'react-free-scrollbar';
import Template from '../../lib/template/template';
import config from './config';

// import './style.less';

export default function Orgcode() {
    return (
        <FreeScrollBar autohide>
            <div className="orgcode_wrapper">
                <Template config={config}/>
            </div>
        </FreeScrollBar>
    );
}
