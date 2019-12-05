/* eslint-disable */
import '@babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import Router from './router/router';
import './style.less';

ReactDOM.hydrate(
    <BrowserRouter><Router/></BrowserRouter>,
    document.getElementById('root'),
);

if (module.hot) {
    module.hot.dispose(function () {
        // 模块即将被替换时
        // console.log("module will be replaced");
    });

    module.hot.accept(function () {
        // 模块或其依赖项之一刚刚更新时
        // console.log("module update");
    });
}