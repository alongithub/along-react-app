// 参数
// custom : {
//      size:  50, [number] 文件大小限制 单位kb
//      types: ['jpeg', 'png', 'jpg'],[array] 文件类型
// }
//
// props : {}; AntD Uoload 的配置参数
//

import React, {Component} from 'react';
import {Icon, Message, Modal, Upload} from "antd";
import {Form} from "antd/lib/form";

class AUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fileList: [],
            imgurl: '',
        }
    }

    componentDidMount() {
        this.props.onRef(this.props.name, this.getValue, this.reset, this.check);
    }

    componentWillReceiveProps(nextProps) {
        const state = {};
        if (nextProps.initValue && (nextProps.initValue !== this.props.initValue)) {
            state.fileList = [{
                uid: '-1',
                name: 'xxx.png',
                status: 'done',
                url: nextProps.initValue,
            }];
            state.imgurl = nextProps.initValue;
            this.setState(state);
        }
    }

    check = () => {
        const {imgurl} = this.state;
        return !!imgurl;
    };
    getValue = () => {
        const {name} = this.props;
        return {[name]: this.state.imgurl};
    };

    reset = () => {
        const {initValue} = this.props;
        const state = {fileList: [], imgurl: ''};
        if (initValue) {
            state.fileList = [{
                uid: '-1',
                name: 'xxx.png',
                status: 'done',
                url: initValue,
            }];
            state.imgurl = initValue;
            this.setState(state);
        } else {
            this.setState(state);
        }
    };

    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    };

    // 上传图片改变时
    handleChange = ({file, fileList}) => {
        const {custom, changeCheck,} = this.props;
        const {types = [], size = 1024} = custom;
        switch (file.status) {
            case 'done': {
                if (fileList.length >= 1) {
                    if (types.indexOf(fileList[0].type.split('/')[1]) === -1 && types.length >= 1) {
                        Message.error(`只支持${types.join('、')}类型的文件`);
                        this.setState({
                            fileList: [],
                            imgurl: '',
                        })
                    } else if (fileList[0].size / 1024 > size) {
                        Message.error(`图片大小不能超过${size}kb`);
                        this.setState({
                            fileList: [],
                            imgurl: '',
                        });
                    } else if (fileList[0].response.code === '0') {
                        Message.error(fileList[0].response.msg);
                        this.setState({fileList: [], imgurl: '',});
                    } else {
                        this.setState({
                            fileList,
                            imgurl: fileList[0].response.data.imgurl,
                        });
                    }
                } else {
                    this.setState({
                        fileList,
                        imgurl: '',
                    });
                }
                break;
            }
            case 'removed': {
                this.setState({fileList, imgurl: ''});
                break;
            }
            case 'error': {
                Message.error('上传失败');
                this.setState({fileList: [], imgurl: ''});
                break;
            }
            default: {
                this.setState({fileList});
                break;
            }
        }
        changeCheck();
    };

    render() {
        const {antprops} = this.props;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <div>
                <Upload
                    {...antprops}
                    fileList={this.state.fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {this.state.fileList.length >= 1 ? null : uploadButton}
                </Upload>
                <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
            </div>
        );
    }
}

export default AUpload;
