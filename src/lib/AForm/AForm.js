/**
 * 示例
 <AForm
 formItem={json}
 type={type}
 url={getMessage}
 params={{id: 1}}
 handleSubmit={(values) => { console.log(values); }}
 handleCancel={() => { this.setState({type: 'form'}); }}
 />
 *
 * 参数
 *** type
 *
 'create' / 'edit'
 *
 *** url
 *
 ''  当 type 为 edit 时, 请求详细信息的地址
 *
 *** params
 *
 {id: 1} 当type 为 edit 是, 请求详细信息的参数
 *
 *** handleSubmit
 *
 function(value) 点击提交时的回调, 返回表单组装后后的所有参数,
 *
 *** handleCancel
 *
 function() 点击取消时的回调
 *
 *** formItem 配置项 参数是一个数组,数组的配置项如下
 *
 url = '', // 下拉框，单选框等等请求地址
 id = 'id', // 下拉框，单选框等等数组的id
 key = 'key', // 下拉框，单选框等等value值的字段
 value = 'value', // 下拉框，单选框等等显示值的字段
 ele = null, // 自定义表单项时, 组件名【class】
 field = '', // 表单提交时字段的键值，提交和获取详情的统一字段键值需一致
 label = '', // 表单相的文字名称
 props = {}, // antd 的配置参数，参照antd 官网
 options = {}, // 校验，默认值等等的配置
 custom = {}, // 自定义组件的参数
 btns = [], // 底部按钮的配置
 createDisable = false, //表单项再新建时是否可编辑
 editDisable = false, //表单项在编辑时是否可编辑
 */
import React, {Component} from 'react';
import {
    Button,
    Input,
    Form,
    Radio,
    Select,
    DatePicker,
    Spin,
    InputNumber,
    TimePicker,
} from 'antd';
import Axios from '../Axios/Axios';
import './style.less';

const RangePicker = DatePicker.RangePicker;
const formItemLayoutDefault = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};
const offsetLayout = {
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 17, offset: 7 },
    },
};
class AForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectLists: {}, // 存储下拉选项及选择框
            detailMessageJson: {}, // edit 时存储详细信息
            loading: false,
        };
    }

    child = {}; // 存储所有子组件

    componentDidMount() {
        this.getList();
    }

    async componentWillReceiveProps(nextProps) {

        if ((nextProps.formItem !== this.props.formItem) && this.props.type === 'edit') {
            this.setState({
                loading: true,
            });
            const detailMessageJson = await Axios.get(this.props.url,this.props.params);

            this.setState({
                loading: false,
            });
            this.setState({
                detailMessageJson: detailMessageJson ? this.handleDetail(detailMessageJson) : {},
            }, () => {
                this.props.form.resetFields();
            });
        }



        // if (nextProps.type !== this.props.type) {
        //     this.props.form.resetFields();
        // }
    }

    isArray = item => {
        return typeof item === 'object' && item.constructor === Array;
    };

    // 处理详细信息
    handleDetail = result => {
        if (result && result.content && result.content.data && result.content.data[0]) {
            return result.content.data[0];
        } else if (result && result.content && result.content[0]) {
             return result.content[0];
        } else if (result && result.content) {
            return result.content;
        } else if (result) {
            return result;
        } else {
            return {}
        }
    };

    // 获取所有请求数据
    getList = async () => {
        const {formItem, type, url, params} = this.props;
        this.setState({
            loading: true,
        });
        const state = {selectLists: {}, detailMessageJson: {}, loading: false};
        const selectLists = {};
        // 并发请求所有数据
        const allPromise = formItem
            .filter(item => !!item.url)
            .map(async item => {
                const result = await Axios.get(item.url,item.params);
                const temp = item.data ? result[item.data] : result.content.list;
                selectLists[item.field] = temp instanceof Array ? temp : [] ;
            });
        // 并发请求详细信息
        if (type === 'edit') {
            allPromise.push(
                (async () => {
                    const result = await Axios.get(url,params);
                    // 后端将edit时获取的信息格式都统一为 {content[{...detail的内容}]}
                    // 接口返回值字段信息不在最外层时指定所在层key值，
                    state.detailMessageJson = this.handleDetail(result);
                })()
            );
        }
        // console.log(allPromise);
        await Promise.all(allPromise);
        // 继发请求所有数据
        // for (let i = 0; i < formItem.length; i ++){
        //     const item = formItem[i];
        //     if (item.url) {
        //         const result = await Axios.post(item.url,item.params);
        //         const temp = item.data ? result[item.data] : result;
        //         selectLists[item.field] = temp instanceof Array ? temp : [] ;
        //     }
        // }
        state.selectLists = selectLists;
        // if (type === 'edit') {
        //     state.detailMessage = await Axios.post(url,params);
        // }
        this.setState(state);
    };

    // 绑定child
    onRef = (name, getValueCallback, resetCallback, checkCallback) => {
        this.child[name] = {
            getValue: getValueCallback,
            reset: resetCallback,
            check: checkCallback,
        };
    };


    // 提交表单
    handleSubmit = (e) => {
        e.preventDefault();
        const { form, handleSubmit } = this.props;
        form.validateFieldsAndScroll({force: true},(err, values) => {
            if (!err) {
                const {child} = this;
                for (let key in child) {
                    if (child.hasOwnProperty(key)){
                        values = {
                            ...values,
                            ...child[key].getValue(),
                        };
                    }
                }
                this.setState({
                    loading: true,
                });
                handleSubmit(values, (bool) => { this.setState({loading: bool}) });
            }
        });
    };

    // 重置表单
    handleReset = () => {
        const {handleReset} = this.props;
        this.props.form.resetFields();
        const {child} = this;
        for (let key in child) {
            if (child.hasOwnProperty(key)) {
                child[key].reset();
            }
        }
        handleReset();
    };

    //自定义表单项的判空
    check = (name, message) => {
        return (rules, value, callback) => {
            // const result = this.child[name].check();

            // 自定义组件返回验证结果，成功为true，失败为false , 可以将返回值在自定义组件中改成具体的提示信息
            if (this.child[name].check()) {
                callback();
            } else {
                callback(message);
            }
            // this.child[name].check(callback, message)
        }
    };

    // 自定义表单项更改时，触发一次校验
    changeCheck = (name, message) => {
        const {form} = this.props;
        const {validateFieldsAndScroll} = form;
        return () => {
            validateFieldsAndScroll([name],{force: true},(err, values) => {
                console.log('AForm检查完成');
            })
        }
    };

    // 组装表单
    installItem = () => {
        const {detailMessageJson} = this.state;
        // console.log(detailMessage);
        const {formItem, form, type, handleCancel, itemLayout, detailKey,} = this.props;

        const detailMessage = detailMessageJson;
        const {
            getFieldDecorator, getFieldsError,
            } = form;
        const formItemLayout = itemLayout ? itemLayout : formItemLayoutDefault;
        if (typeof formItem !== 'object' || formItem.constructor !== Array){
            return '';
        }
        return formItem.map(item => {
            const {
                id = 'id',
                key = 'key',
                value = 'value',
                ele = null,
                field = '',
                label = '',
                props = {},
                options = {},
                custom = {},
                btns = [],
                content = '',
                createDisable = false,
                editDisable = false,
                dataSource = [],
                classname = '',
                } = item;
            const disabled = type === 'create' ? createDisable : editDisable;
            switch (item.type) {
                case 'custom': {
                    const {initialValue = ''} = options;
                    const defaultValue = (
                        type === 'edit'
                            ? (
                            field instanceof Array
                                ? field.map(f => detailMessage[f]
                                ? detailMessage[f]
                                : ''
                            )
                                : detailMessage[field]
                                ? detailMessage[field]
                                : ''
                        )
                            : initialValue
                    );
                    const {rules = []} = options;
                    const [rule = {}] = rules;
                    const {required = false, message = `please input ${field}`} = rule;
                    const checkOption = {};
                    if (required) {
                        checkOption.rules = [
                            {required: true, message: ' '},
                            {validator: this.check(field, message)}
                        ];
                        checkOption.initialValue = 1;
                    }
                    const tempField = field instanceof Array ? field[0] : field;
                    return (
                        <Form.Item label={label} key={field} {...formItemLayout}>
                            {
                                getFieldDecorator(tempField, {
                                    ...checkOption
                                })(
                                    React.createElement(
                                        ele,
                                        {
                                            changeCheck: this.changeCheck(tempField, message),
                                            onRef: this.onRef,
                                            antprops: props,
                                            name: field,
                                            initValue: defaultValue,
                                            custom: custom,
                                            disabled: disabled,
                                        }
                                    )
                                )
                            }
                        </Form.Item>
                    )
                }
                case 'number': {
                    const {
                        initialValue = '',
                        } = options;
                    const defaultValue = type === 'edit'
                        ? (detailMessage[field] || detailMessage[field] == 0
                        ? detailMessage[field]
                        : initialValue)
                        : initialValue;
                    return (
                        <Form.Item label={label} key={field} {...formItemLayout}>
                            {
                                getFieldDecorator(field, {...options, initialValue: defaultValue})(
                                    <InputNumber disabled={disabled} {...props}/>
                                )
                            }
                        </Form.Item>
                    )
                }
                case 'input': {
                    const {
                        initialValue = '',
                        } = options;
                    const defaultValue = type === 'edit'
                        ? (typeof detailMessage[field] !== "undefined"
                            ? detailMessage[field]
                            : initialValue)
                        : initialValue;
                    console.log('defaultvalue' ,field,defaultValue);
                    return (
                        <Form.Item label={label} key={field} {...formItemLayout}>
                            {
                                getFieldDecorator(field, {...options, initialValue: defaultValue})(
                                    <Input disabled={disabled} {...props}/>
                                )
                            }
                        </Form.Item>
                    )
                }
                case 'password': {
                    const {
                        initialValue = '',
                    } = options;
                    const defaultValue = type === 'edit'
                        ? (typeof detailMessage[field] !== "undefined"
                            ? detailMessage[field]
                            : initialValue)
                        : initialValue;
                    console.log('defaultvalue' ,field,defaultValue);
                    return (
                        <Form.Item label={label} key={field} {...formItemLayout}>
                            {
                                getFieldDecorator(field, {...options, initialValue: defaultValue})(
                                    <Input.Password disabled={disabled} {...props}/>
                                )
                            }
                        </Form.Item>
                    )
                }
                case 'radio': {
                    const {
                        initialValue = '',
                        } = options;
                    const defaultValue = (type === 'edit'
                        ? (detailMessage[field]
                        ? detailMessage[field]
                        : '')
                        : (this.state.selectLists[item.field]
                            ? this.state.selectLists[item.field][0][item.key]
                            : initialValue
                    ) );
                    return (
                        <Form.Item label={label} key={field} {...formItemLayout}>
                            {getFieldDecorator(field, {...options, initialValue: defaultValue})(
                                <Radio.Group disabled={disabled} {...props}>
                                    {this.state.selectLists[field]
                                        ? this.state.selectLists[field].map(r => <Radio key={r[id]} value={r[key]}>{r[value]}</Radio>)
                                        : dataSource.map(r => <Radio key={r[id]} value={r[key]}>{r[value]}</Radio>)}
                                </Radio.Group>,
                            )}
                        </Form.Item>
                    )
                }
                case 'select': {
                    const {
                        initialValue = (type === 'edit' ? (typeof detailMessage[field] !== "undefined" ? detailMessage[field] : undefined) : undefined),
                        } = options;

                    return (
                        <Form.Item label={label} key={field} {...formItemLayout}>
                            {getFieldDecorator(field, {...options, initialValue: typeof initialValue === 'number' ? String(initialValue) : initialValue})(
                                <Select
                                    disabled={disabled}
                                    {...props}
                                >
                                    {
                                        this.state.selectLists[field] ? this.state.selectLists[field].map(list => (
                                            <Select.Option key={list[id]} value={list[key]}>
                                                {list[value]}
                                            </Select.Option>
                                        )) : dataSource.map(r => <Select.Option key={r[id]} value={r[key]}>{r[value]}</Select.Option>)
                                    }
                                </Select>
                            )}
                        </Form.Item>
                    )
                }
                case 'textarea': {
                    const {
                        initialValue = '',
                        } = options;
                    const defaultValue = type === 'edit' ? (detailMessage[field] ? detailMessage[field] : initialValue) : initialValue;
                    return (
                        <Form.Item
                            {...formItemLayout}
                            label={label}
                            key={field}
                            {...formItemLayout}
                            className={classname}
                        >
                            {getFieldDecorator(field, {...options, initialValue: defaultValue})(
                                <Input.TextArea disabled={disabled} {...props}/>,
                            )}
                        </Form.Item>
                    )
                }
                case 'rangePicker': {
                    return (
                        <Form.Item
                            label={label}
                            key={field}
                            {...formItemLayout}
                        >
                            {getFieldDecorator(field, options)(
                                <RangePicker disabled={disabled} {...props}/>
                            )
                            }
                        </Form.Item>
                    )
                }
                case 'datePicker': {
                    return (
                        <Form.Item
                            label={label}
                            key={field}
                            {...formItemLayout}
                        >
                            {getFieldDecorator(field, options)(
                                <DatePicker disabled={disabled} {...props}/>
                            )
                            }
                        </Form.Item>
                    )
                }
                case 'timePicker': {
                    return (
                        <Form.Item
                            label={label}
                            key={field}
                            {...formItemLayout}
                        >
                            {getFieldDecorator(field, options)(
                                <TimePicker disabled={disabled} {...props}/>
                            )
                            }
                        </Form.Item>
                    )
                }
                case 'button': {
                    return (
                        <Form.Item label={label} key={field} {...offsetLayout}>
                            {
                                btns.map((btn, index) => {
                                    return <Button
                                        key={index}
                                        type={btn.type}
                                        htmlType={btn.htmlType}
                                        onClick={
                                            btn.htmlType === 'reset'
                                                ? this.handleReset
                                                : (
                                                    btn.htmlType === 'button'
                                                        ? handleCancel
                                                        : null
                                                    )
                                            }
                                        {...btn.props}
                                        style={{marginRight: '15px'}}
                                    >
                                        {btn.text}
                                    </Button>
                                })
                            }
                        </Form.Item>
                    )
                }
                case 'lableline': {
                    return <div key={field}>{content}</div>;
                }
                default: return '';
            }
        })
    };

    render() {
        const {loading} = this.state;
        return (
            <div  className="along_form_wrapper">
                <Spin spinning={loading}>
                    <div className="along_form">
                        <Form onSubmit={this.handleSubmit}>
                            {this.installItem()}
                        </Form>
                    </div>
                </Spin>
            </div>
        )
    }
}

export default Form.create()(AForm);


/*
 const getMessage = '/getMessage';

 const json = [
 {
 type: 'input',
 label: '名称',
 field: 'name',
 props: {
 prefix: <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />,
 placeholder: '请输入姓名',
 disabled: true,
 },
 options: {
 // initialValue: 'jiangweilong',
 rules: [
 {
 required: true, message: '请输入姓名',
 },
 ],
 },
 },
 // 人员类型
 {
 type: 'radio',
 label: '人员类型',
 field: 'typecode',
 url: '/getTypecodes',
 params: {},
 data: '', // radio数组字段名
 key: 'key', // value
 value: 'value', // radio 里显示的内容
 id: 'id', // radio遍历的id
 options: {
 rules: [{
 required: true, message: '请选择人员类型',
 }],
 },
 },
 // 流转地点
 {
 type: 'select',
 label: '流转地点',
 field: 'address',
 url: '/getAddressList',
 data: '',
 key: 'code',
 value: 'name',
 id: 'id',
 props: {
 suffixIcon: <Icon type="environment" style={{ color: 'rgba(0,0,0,.25)' }} />,
 placeholder: 'Select a person',
 showSearch: true,
 optionFilterProp: 'children',
 filterOption: (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0,
 },
 options: {
 rules: [
 {
 required: true, message: '请选择流转地点',
 },
 ],
 },
 },
 {
 type: 'number',
 label: '偏离距离',
 field: 'offset',
 props: {
 placeholder: '请输入偏离距离',
 style: {
 width: '300px',
 },
 min: 0,
 },
 options: {
 initialValue: 10,
 rules: [
 {
 required: true, message: '请输入偏离距离',
 },
 ],
 },
 },
 {
 type: 'custom',
 label: '驻停时间',
 field: ['residenttime', 'residentdistance'],
 ele: Residen,
 options: {
 initialValue: [0, 0],
 },
 },
 {
 type: 'custom',
 label: '时间区间',
 field: ['startTime', 'endTime'],
 ele: AInlineDatePicker,
 options: {
 initialValue: ['2013-3-2', '2018-4-5'],
 },
 },
 // 手机号
 {
 type: 'input',
 label: '手机号',
 field: 'number',
 createDisable: false,
 editDisable: true,
 props: {
 placeholder: '请输入手机号码',
 },
 options: {
 rules: [
 {
 // 如果自己的校验规则里已经包含了必填，
 // 必填的提示在require：true的配置里一定要有一个messag配置成一个空格
 required: true, message: ' ',
 },
 {
 validator: validateStowage,
 },
 ],
 },
 },
 // 备注
 {
 type: 'textarea',
 label: '试卷信息',
 field: 'message',
 props: {
 placeholder: '请输入试卷信息',
 rows: 4,
 },
 options: {
 initialValue: '备注信息默认',
 },
 },
 // 起止时间
 {
 type: 'rangePicker', // 返回的时间是个moment对象数组，需要format ，format('x'),format('YYYY-MM-DD')
 label: '起止时间',
 field: 'timeRange',
 props: {
 style: {width: '100%'},
 format: 'YYYY-MM-DD',
 placeholder: ['开始时间', '结束时间'],
 },
 options: {
 initialValue: [moment('2015-01-01'), moment('2015-10-10')],
 },
 },
 // 出生年月
 {
 type: 'datePicker',
 label: '出生年月',
 field: 'birth',
 props: {
 placeholder: '请选择出生日期',
 },
 options: {
 required: true, message: '请选择出生日期',
 },
 },
 // 自定义出生年月
 {
 type: 'custom',
 ele: ADatePicker,
 label: '自定义出生年月',
 field: 'cosbirth',
 props: {
 placeholder: '请选择出生日期',
 },
 custom: {
 format: 'YYYY-MM-DD',
 },
 },
 // 自定义上传图片
 {
 type: 'custom',
 ele: AUpload,
 label: '上传图片',
 field: 'imgurl',
 props: {
 action: '/track/upload',
 listType: 'picture-card',
 name: 'photo',
 },
 custom: {
 types: ['jpeg', 'png', 'jpg'],
 size: 50, // kb
 },
 },
 // 按钮
 {
 type: 'button',
 label: '',
 field: 'button',
 btns: [
 {
 htmlType: 'submit',
 type: 'primary',
 text: '提交',
 },
 {
 htmlType: 'reset',
 type: 'default',
 text: '重置',
 },
 {
 htmlType: 'button',
 type: 'default',
 text: '取消',
 },
 ],
 },
 ];
 */
