import React, {useEffect, useState, useCallback, useMemo} from 'react';
import {
    Table, Row, Col, Input, Button, Modal, message, Tooltip,
} from 'antd';
import Axios from '../../lib/Axios/Axios';
import './style.less';
import AForm from "../AForm/AForm";
import tool from "../tool/tool";

const { Search } = Input;



export default function Template({
     config,
     sendData, // 父组件如果传递过来这个参数，template每次有 选中条目改变会讲数据传递给父组件供外部使用
     otherParams = {},
     className = '',
     currentkey = {}, // 有组织结构树时会传过来一个当前选中的机构
     loadDateWithOtherParams = true,
     shouldUpdate = 0, // 外部触发template更新时可以穿这个参数，更改update数值
     settingOSD = () => {}, // 设置单条OSD
}) {
    const {
        columns, // 表头
        dataSourceUrl, // 列表数据地址
        dataDetailUrl, // 获取某条数据的详情
        title, // 标题名称
        rowKey, // 指定rowKey的键值
        AFormConfig = {}, // Aform 相关参数
        isHiddenDefaultHead = false, // 隐藏默认的标题导出导出添加和搜索功能
        searchPlaceholder = '', // 搜索默认提示
        canSelect = false, // 是否展示table选择框
        optionid,
    } = config;


    const [loading, setLoading] = useState(false);

    // table 数据
    const [dataSource, setDataSource] = useState([]);
    const [searchValue, setSearchValue] = useState('');

    // 存储当前页码
    const [pageNumber, setPageNumber] = useState(1);
    // 存储条目总数
    const [total, setTotal] = useState(0);

    // 设备管理界面的特殊处理
    const [deviceType, setDeviceType] = useState('frontDevice');

    // 设备管理界面特殊处理，前端设备添加编辑时多两个字段。
    if (title === '设备管理') {
        if (deviceType === 'frontDevice') {
            for (let key in AFormConfig.aFormJson) {
                if (AFormConfig.aFormJson[key].field === 'recHost' || AFormConfig.aFormJson[key].field === 'recChannel') {
                    AFormConfig.aFormJson[key].type = 'select';
                }
            }
        } else {
            for (let key in AFormConfig.aFormJson) {
                if (AFormConfig.aFormJson[key].field === 'recHost' || AFormConfig.aFormJson[key].field === 'recChannel') {
                    AFormConfig.aFormJson[key].type = '';
                }
            }
        }
    }

    const initTitle = useMemo(() => {
        return title === '设备管理' ? <ul className="template_title_ul">
            <li className={deviceType === 'frontDevice' ? "template_title_li on" : "template_title_li"} onClick={() => {setDeviceType('frontDevice')}}>前端设备</li>
            <li className={deviceType === 'recordDevice' ? "template_title_li on" : "template_title_li"} onClick={() => {setDeviceType('recordDevice')}}>存储设备</li>
            <li className={deviceType === 'decodeDevice' ? "template_title_li on" : "template_title_li"} onClick={() => {setDeviceType('decodeDevice')}}>解码设备</li>
        </ul> : <ul className="template_title_ul">
            <li className="template_title_li on">{title}</li>
        </ul>;
    }, [title, deviceType]);

    const searchData = (value) => {
        setSearchValue(value);
        setPageNumber(1);
        getTabledata(1, value);
    };

    // 请求获取table数据
    const getTabledata = async (page, value) => {
        // 如果是外部刷新，page=0，则默认加载第一页，清空searchvalue
        let outrefresh = false;
        if (page === 0) {
            // 如果page为0，设置页码和searchvalue为1 和 空，再进行查询
            setPageNumber(1);
            setSearchValue(value);
            outrefresh = true;
            // getTabledata(1, '');
            // return;
        }
        if (outrefresh || loadDateWithOtherParams) {
            setLoading(true);
            const params = {
                page: outrefresh ? 1 : page,
                limit: 10,
                value: outrefresh ? '' : value,
                isExport: 0,
                ...otherParams,
            };

            // 如果 没有机构树，默认传一个当前用户的id 和 code
            if (!params.orgid) {
                params.orgid = orgid;
            }

            if (!params.orgcode) {
                params.orgcode = orgcode;
            }
            // 如果是设备界面添加设备类型参数
            if (title === '设备管理') {
                params.deviceType = deviceType;
            }
            const list = await Axios.get(dataSourceUrl, params);
            setLoading(false);
            if (list && list.content &&  list.content.data && typeof list.content.data === 'object' && list.content.data.constructor === Array) {
                for (let i = 0; i < list.content.data.length; i += 1) {
                    if (rowKey) {
                        if (list.content.data[i][rowKey] === null) {
                            list.content.data[i][rowKey] = 'n' + Math.random();
                        }
                    }
                }
                setDataSource(list.content.data);
                setTotal(list.content.count);
            }
        } else {
            setLoading(false);
        }
    };

    // 改变当前页码
    const changePage = (num) => {
        setPageNumber(num);
        getTabledata(num, searchValue);
    };

    // 删除数据
    const deleteMsg = async (record) => {
        const params = {content: [{}]};
        params.content[0][rowKey] = record[rowKey];
        if (title === '设备管理') {
            params.deviceType = deviceType;
        }
        setLoading(true);
        const result = await Axios.delete(dataSourceUrl, params);
        if (result) {
            message.success('删除成功');
            getTabledata(pageNumber, searchValue);
        } else {
            setLoading(false);
        }
    };

    // 启用禁用数据
    const freezeMsg = async (record, num) => {
        const params = {};
        params[rowKey] = record[rowKey];
        params.isFreeze = num;
        if (title === '设备管理') {
            params.deviceType = deviceType;
        }
        setLoading(true);
        const result = await Axios.put(dataSourceUrl, params);
        if (result) {
            message.success(num === 0 ? '启用成功' : '禁用成功');
            getTabledata(pageNumber, searchValue);
        } else {
            setLoading(false);
        }
    };

    // 恢复备份文件
    const recover = async (record) => {
        const params = {filename: record.filename};
        setLoading(true);
        const result = await Axios.put(dataSourceUrl, params, '备份文件恢复失败');
        if (result) {
            message.success('恢复成功');
            getTabledata(pageNumber, searchValue);
        } else {
            setLoading(false);
        }
    };

    // 重新加载table时的依赖项，比如机构改变，设备类型改变，只要有一个外部传入的请求参数（otherParams）项改变，就重新加载table数据
    // 默认依赖设备类型和loadDateWithOtherParams
    // loadDateWithOtherParams的意思是，是否允许otherparms改变时或者第一次获取这个props时请求或刷新table数据，因为otherparams是一个json对象，每次传过来的都是新的
    // 考虑过在父组件用useMemo时传过来的otherparams保持不变，但是在第一次获取otherParams时可能不适用
    // 比如传过来的机构代码，在用户选中学校时才能取到有效的学校orgCode，但是第一次取到的是空字符串，这时候不应请求table数据
    // 所以加了一个loadDateWithOtherParams参数，false时即使参数改变也不会请求数据，不传时默认为true
    // 在getTabledata方法中，会先判断loadDateWithOtherParams参数（比如，避免在未选中学校时用户点击了模糊搜索导致发送了table数据请求）
    const reloadDataBy = [deviceType, loadDateWithOtherParams, shouldUpdate];

    for (let key in otherParams) {
        reloadDataBy.push(otherParams[key]);
    }
    useEffect(() => {
        setPageNumber(1);
        getTabledata(1, '');
    }, reloadDataBy);

    // 控制 添加编辑查看的弹出窗口
    const [type, setType] = useState('');
    // 保存当前编辑或修改时的主键id
    const [id, setId] = useState('');
    // 确认修改或添加
    const modelHandleOk = useCallback(async (values) => {
        // 如果是添加跳转到第一页
        if (currentkey.orgcode) {
            values.orgcode = currentkey.orgcode;
        }
        if (currentkey.typecode) {
            values.orgtype = currentkey.orgtype;
        }


        if (type === 'create') {
            // 请求添加
            const params = {};
            values.currentuserorgcode = orgcode;
            values.currentuserorgid = orgid;
            params.content = [values];
            if (title === '设备管理') {
                params.deviceType = deviceType;
                params.content[0].devStatus = '不在线';
            }
            const res = await Axios.post(dataSourceUrl, params);
            if (res) {
                message.success('添加成功');
                setSearchValue('');
                changePage(1);
            }
        } else if (type === 'edit') {
            const params = values;
            // 请求修改
            if (title === '设备管理') {
                params.deviceType = deviceType;
            }
            params[rowKey ? rowKey : optionid] = id;

            const res = await Axios.put(dataSourceUrl, params);
            if (res) {
                message.success('修改成功');
                setSearchValue('');
                getTabledata(pageNumber, searchValue);
            }
        }

        setType('');

    }, [type, currentkey]);
    const modelHandleCancel = useCallback(() => {
        setType('');
    }, []);
    const changeCreate = useCallback(() => {
        if (loadDateWithOtherParams) {
            // if (title === '机构代码管理' && orgtype === '1111') {
            //     Modal.confirm({
            //         title: '校级用户不能添加机构'
            //     })
            // }
            setType('create');
        } else {
            Modal.confirm({
                title: '请先选择机构',
                okText: '确认',
                cancelButtonProps: {
                    style: {display: 'none'},
                },
            })
        }
    }, [loadDateWithOtherParams]);

    const refreshdata = () => {
        getTabledata(pageNumber, searchValue)
    };

    const model = useMemo(() => {
        const {
            wrapperClass,
            aFormJson,
            modelWidth,
            modelTitle,
        } = AFormConfig;

        // parentOrgName
        const orgname = decodeURI(tool.getCookie('orgname'));
        // const orgid = tool.getCookie('orgid');
        // const orgcode = tool.getCookie('orgcode');
        const orgtype = tool.getCookie('orgtype');
        for (let key in aFormJson) {
            if (aFormJson[key].field === 'parentOrgName') { // 添加构代码时所属机构名称
                if (!aFormJson[key].options) {
                    aFormJson[key].options = {}
                }
                aFormJson[key].options.initialValue = orgname;
                if (type === 'edit') {
                    aFormJson[key].options.initialValue = undefined;
                }
            }
            if (aFormJson[key].field === 'orgType') { // 添加机构代码时所属当前机构类型
                if (!aFormJson[key].options) {
                    aFormJson[key].options = {}
                }
                if (orgtype === '1001') {
                    aFormJson[key].options.initialValue = '1010';
                } else if (orgtype === '1010') {
                    aFormJson[key].options.initialValue = '1011';
                } else if (orgtype === '1011') {
                    aFormJson[key].options.initialValue = '1111';
                }
                if (type === 'edit') {
                    aFormJson[key].options.initialValue = undefined;
                }

            }
            if (currentkey.orgname) {
                const orgname = currentkey.orgname;
                if (aFormJson[key].field === 'orgname' || aFormJson[key].field === 'kdmc' || aFormJson[key].field === 'devParentOrgName') {
                    if (!aFormJson[key].options) {
                        aFormJson[key].options = {}
                    }
                    aFormJson[key].options.initialValue = orgname;
                    if (type === 'edit') {
                        aFormJson[key].options.initialValue = undefined;
                    }
                }
            }
            if (currentkey.typename) {
                let typename = currentkey.typename;
                let orgcode;
                switch (typename) {
                    case '省': orgcode = '1001'; break;
                    case '市': orgcode = '1010'; break;
                    case '区县': orgcode = '1011'; break;
                    case '学校': orgcode = '1111'; break;
                    default: orgcode = '';
                }
                if (aFormJson[key].field === 'usertype') {
                    if (!aFormJson[key].options) {
                        aFormJson[key].options = {}
                    }
                    aFormJson[key].options.initialValue = orgcode;
                    if (type === 'edit') {
                        aFormJson[key].options.initialValue = undefined;
                    }
                }
            }
        }

        // 如果有所属机构添加orgname orgtype







        const params = {
            page: 1,
            limit: 1,
        };
        params[rowKey ? rowKey : optionid] = id;
        if (title === '设备管理') {
            params.deviceType = deviceType;
        }
        return <Modal
            title={type === 'create' ? `添加${modelTitle}` : `编辑${modelTitle}`}
            visible={type !== ''}
            footer={null}
            width={modelWidth}
            destroyOnClose
            // onOk={modelHandleOk}
            onCancel={modelHandleCancel}
        >
            <div className={wrapperClass}>
                <AForm
                    formItem={aFormJson}
                    detailKey="content"
                    type={type}
                    url={dataSourceUrl}
                    params={params}
                    handleSubmit={modelHandleOk}
                    handleCancel={modelHandleCancel}
                />
            </div>
        </Modal>
    }, [type]);

    // 选中的条目
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys) => {
            const filterseleterowkeys = selectedRowKeys.filter(l => !(/n/.test(String(l))));
            if (sendData) {
                // 将table的选中的row集合以及设置函数暴露给需要的父组件（如果用redux或者context会方便点）
                sendData({
                    selectedRowKeys: filterseleterowkeys,
                    // setSelectedRowKeys,
                    // getTabledata,
                })
            }
            setSelectedRowKeys(filterseleterowkeys);
        },
    };

    useEffect(() => {
        if (sendData) {
            // 将外部可能用到的函数暴露给需要的父组件（如果用redux或者context会方便点）
            sendData({
                setSelectedRowKeys,
                getTabledata,
                setLoading,
            })
        }
    }, [loadDateWithOtherParams]);


    // 导出数据
    const exportExcel = async () => {
        console.log(pageNumber, orgid, orgcode, deviceType);
        if (title === '用户管理') {
            const baseurl = typeof GLOBAL_CONFIG !== 'undefined' ? GLOBAL_CONFIG.baseurl2 : 'http://192.168.2.170:8080/sip_web_maven';
            const filename = (otherParams.orgcode || orgcode) + '用户表';
            const params = baseurl + '/userManage/exportUserExcel?%7B%22filename%22:%22' + filename + '%22,%22orgcode%22:%22' + (otherParams.orgcode || orgcode) + '%22%7D';
            console.log(params);
            window.location.href = params;
        } else {
            const result = await Axios.get(dataSourceUrl, {
                page: 1,
                limit: 1000000,
                value: '',
                deviceType,
                orgid: otherParams.orgid || orgid,
                orgcode: otherParams.orgcode || orgcode,
                isExport: 1,
            }, '导出数据失败');
            if (result) {
                if (result && result.content && result.content.exportUrl) {
                    window.location.href = 'http://' + result.content.exportUrl;
                } else {
                    message.error('导出数据失败');
                }
            }
        }
    };

    return (
        <div className={className}>
            <Row>
                <Col span={24}>
                    <div className="template_wrapper">
                        {
                            isHiddenDefaultHead
                                ? ''
                                : <div className="template_title">
                                    {initTitle}
                                    <Search
                                        placeholder={searchPlaceholder}
                                        onSearch={searchData}
                                        style={{ width: 200, margin: '0 20px' }}
                                    />
                                    <div className="rightBtn">
                                        <Button icon="plus" onClick={changeCreate}>添加</Button>
                                    </div>
                                    <div className="rightBtn">
                                        <Button onClick={exportExcel} icon="vertical-align-bottom">导出</Button>
                                    </div>
                                    <div className="rightBtn">
                                        <Button icon="plus" icon="reload" loading={loading} onClick={refreshdata}>刷新</Button>
                                    </div>
                                    {/* {
                                        title === '设备管理'
                                            ?  <div className="rightBtn">
                                                <Button type="primary">提交到上级平台</Button>
                                            </div>
                                            : ''
                                    } */}
                                </div>
                        }
                        <div className="template_table">
                            <Table
                                rowSelection={canSelect ? rowSelection : null}
                                rowClassName={(record) => {
                                    if (/n/.test(String(record[rowKey]))) {
                                        return "template_table_row template_table_row_disable";
                                    } else {
                                        return "template_table_row"
                                    }
                                }}
                                dataSource={dataSource}
                                loading={loading}
                                rowKey={(record) => {
                                    return record[rowKey];
                                }}
                                pagination={{
                                    total: total,
                                    showTotal: total => `共 ${total} 条`,
                                    // showQuickJumper: true,
                                    pageSize: 10,
                                    current: pageNumber,
                                    onChange: changePage,
                                }}
                                columns={columns.map(l => {
                                    if (!l.render) {
                                        l.render = (text) => <Tooltip title={text}>{text}</Tooltip>
                                    }
                                    return l;
                                })}
                                size="middle"
                                onRow={record => ({
                                    onClick: (e) => {
                                        // 如果这条数据没有主键，禁止操作，用于设备分配界面
                                        if (optionid) {
                                            if (!record[optionid]) {
                                                return;
                                            }
                                        }
                                        switch (e.target.className) {
                                            case 'table-class-edit':
                                                setType('edit');
                                                setId(record[rowKey ? rowKey : optionid]);
                                                // changePage ? changePage('edit', record.id) : null;
                                                break;
                                            case 'table-class-start':
                                                Modal.confirm({
                                                    title: '启用此条记录吗？',
                                                    cancelText: '取消',
                                                    okText: '启用',
                                                    onOk() {
                                                        freezeMsg(record, 0);
                                                    },
                                                });
                                                // toggleMod ? toggleMod(true, record) : null;
                                                break;
                                            case 'table-class-freeze':
                                                Modal.confirm({
                                                    title: '禁用此条记录吗？',
                                                    cancelText: '取消',
                                                    okText: '禁用',
                                                    onOk() {
                                                        freezeMsg(record, 1);
                                                    },
                                                });
                                                // toggleMod ? toggleMod(true, record) : null;
                                                break;
                                            case 'table-class-delete':
                                                Modal.confirm({
                                                    title: '确定要删除此信息吗?',
                                                    content: '删除后无法恢复',
                                                    cancelText: '取消',
                                                    okText: '确定',
                                                    onOk() {
                                                        deleteMsg(record);
                                                    },
                                                });
                                                break;
                                            case 'table-class-setting':
                                                settingOSD(record);
                                                break;
                                            case 'table-class-play':
                                                console.log(record);
                                                let channel = '';
                                                if (typeof record.devChannel !== 'undefined') {
                                                    channel = record.devChannel;
                                                }
                                                if (typeof record.channel !== 'undefined') {
                                                    channel = record.channel;
                                                }
                                                break;
                                            case 'table-class-recover':
                                                // 恢复数据
                                                Modal.confirm({
                                                    title: '恢复该备份文件吗?',
                                                    cancelText: '取消',
                                                    okText: '确定',
                                                    onOk() {
                                                        recover(record);
                                                    },
                                                });
                                                break;
                                            default:
                                                break;
                                        }
                                    },
                                })}
                            />
                        </div>
                    </div>
                    {model}
                </Col>
            </Row>
        </div>
    );
}
