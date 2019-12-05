import React from 'react';
// import {tool} from 'tool.js.jyd';
import configUtil from '../../lib/template/utils/configUtil';

const headMapKey = {
    机构代码: 'orgCode',
    机构名称: 'orgName',
    所属机构: 'parentOrgName',
    所属机构代码: 'currentuserorgcode',
    机构类型: 'orgType',
    是否启用: 'isFreeze',
};
// const orgcode = tool.getCookie('orgcode');
// const orgtype = tool.getCookie('orgtype');
// const orgname = decodeURI(`${tool.getCookie('orgname')}`);

const mapTable = configUtil.mapTable(headMapKey);
const mapForm = configUtil.mapForm(headMapKey);
const config = {
    title: '机构代码管理',
    isDevice: true,
    rowKey: 'orgID',
    dataSourceUrl: '/baseInfo/orgcodeInfo',
    dataDetailUrl: '/baseInfo/getDeviceDetail',
    searchPlaceholder: '请输入机构代码或名称',
    dataUpdateUrl: '',
    dataCreateUrl: '',
    importExcelHead: headMapKey,
    columns: [
        mapTable('机构代码', {filterable: true}),
        mapTable('机构名称', {filterable: true}),
        mapTable('所属机构'),
        mapTable('机构类型', {
            render: (item) => {
                switch (item) {
                case '1001': return '省';
                case '1010': return '市';
                case '1011': return '区县';
                case '1111': return '学校';
                default: return '';
                }
            },
        }),
        mapTable('是否启用', {
            render: (item) => {
                switch (item - 0) {
                case 0: return '是';
                case 1: return '否';
                default: return '';
                }
            },
        }),
        {
            title: '操作',
            dataIndex: 'op',
            key: 'op',
            render: (item, record) => (
                <div>
                    {
                        record.isFreeze - 0 === 0
                            ? <span className="table-class-freeze">禁用</span>
                            : <span className="table-class-start">启用</span>
                    }
                    <span className="table-class-edit">编辑</span>
                    <span className="table-class-delete">删除</span>
                </div>
            ),
        },
    ],
    AFormConfig: {
        modelTitle: '机构代码',
        wrapperClass: 'orgCode_model_wrapper',
        modelWidth: 600,
        aFormJson: [
            {
                type: 'input',
                ...mapForm('机构代码'),
                createDisable: false,
                editDisable: false,
                options: {
                    rules: [{required: true, message: ''}],
                },
            },
            {
                type: 'input',
                ...mapForm('机构名称'),
                createDisable: false,
                editDisable: false,
                options: {
                    rules: [{required: true, message: ''}],
                },
            },
            {
                type: 'input',
                ...mapForm('所属机构'),
                // data: 'content',
                // url: '/baseInfo/orgcodeInfo',
                // id: 'orgName',
                // key: 'orgName',
                // value: 'orgName',
                // dataSource: [
                //     {id: '0', key: orgcode, value: orgname},
                // ],
                // options: {
                //     initialValue: orgcode,
                // },
                createDisable: true,
                editDisable: true,
            },
            {
                type: 'select',
                ...mapForm('机构类型'),
                dataSource: [
                    {id: '1', key: '1001', value: '省'},
                    {id: '2', key: '1010', value: '市'},
                    {id: '3', key: '1011', value: '区'},
                    {id: '4', key: '1111', value: '学校'},
                ],
                createDisable: false,
                editDisable: true,
            },
            {
                type: 'select',
                ...mapForm('是否启用'),
                dataSource: [
                    {id: '1', key: '1', value: '否'},
                    {id: '2', key: '0', value: '是'},
                ],
                createDisable: false,
                editDisable: false,
                options: {
                    rules: [{required: true, message: ''}],
                },
            },
            {
                type: 'button',
                label: '',
                field: 'button',
                btns: [
                    {
                        htmlType: 'submit',
                        type: 'primary',
                        text: '确认',
                    },
                    {
                        htmlType: 'button',
                        type: 'default',
                        text: '取消',
                    },
                ],
            },
        ],
    },
};

export default config;
