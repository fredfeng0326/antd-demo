import React, {Component} from 'react';
import './App.css';
import {Button} from 'antd';
import {Player} from 'video-react';
import {Row, Col, Upload, Icon, message, Input, Card} from 'antd';
import {Editor} from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

class Image extends Component {
    render() {
        const {Dragger} = Upload;
        const fileList = [];
        const props = {
            name: 'file',
            multiple: true,
            action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
            onChange(info) {
                const {status} = info.file;
                if (status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (status === 'done') {
                    message.success(`${info.file.name} file uploaded successfully.`);
                } else if (status === 'error') {
                    message.error(`${info.file.name} file upload failed.`);
                }
            },
            listType: 'picture',
            defaultFileList: [...fileList],
        };
        return (
            <div className="image">
                <h3>Upload Image (Drag or Upload,Support multi)</h3>
                <Dragger {...props}>
                    <p className="ant-upload-drag-icon">
                        <Icon type="inbox"/>
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single or bulk upload. Strictly prohibit from uploading company data or
                        other
                        band files
                    </p>
                </Dragger>
            </div>
        )
    }
}

class Video extends Component {
    state = {
        fileList: [],
        selectedAttachment: null
    };

    viewAttachment = file => {
        let reader = new FileReader();

        //if reading completed
        reader.onload = e => {
            //set values of selected attachment
            let newSelectedAttachment = {};
            newSelectedAttachment.file = file;
            newSelectedAttachment.blobData = e.target.result;

            //if file type is image then show the attachment or download the same
            if (file.type.includes("video")) {
                this.setState({
                    selectedAttachment: newSelectedAttachment
                });
            }
        };

        //read the file
        reader.readAsDataURL(file);
    };

    render() {
        return (
            <div className="video">
                <h3>Upload Video</h3>
                <Upload
                    multiple={false}
                    beforeUpload={e => false}
                    showUploadList={false}
                    onChange={info => {
                        if (info.file.status !== "uploading") {
                            let newFileList = this.state.fileList;
                            newFileList.push(info.file);
                            this.setState({
                                fileList: newFileList
                            });
                        }
                    }}
                >
                    <Button>
                        <Icon type="upload"/> Upload
                    </Button>
                </Upload>
                {this.state.fileList.length > 0 && (
                    <ul>
                        {this.state.fileList.map((file, index) => {
                            return (
                                <li
                                    onClick={() => this.viewAttachment(file)}
                                    style={{cursor: "pointer"}}
                                    key={index}
                                >
                                    {file.name}
                                </li>
                            );
                        })}
                    </ul>
                )}
                {this.state.selectedAttachment && (
                    <Player
                        playsInline
                        fluid={false}
                        width={400}
                        height={200}
                        poster="/assets/poster.png"
                        src={this.state.selectedAttachment.blobData}
                    />
                )}

            </div>
        )
    }
}

class Texts extends Component {
    state = {
        name: '',
        path: '',
        preview: null,
        data: null
    }

    changeName = (e) => {
        this.setState({name: e.target.value})
    }

    changePath = (e) => {
        const file = e.target.files[0];
        if (!file) {
            return;
        }

        let src, preview, type = file.type;

        if (/^text\/\S+$/.test(type)) {
            const self = this;
            const reader = new FileReader();
            reader.readAsText(file);
            //注：onload是异步函数，此处需独立处理
            reader.onload = function (e) {
                preview = <textarea cols={40} rows={10} value={this.result} readOnly></textarea>
                self.setState({path: file.name, data: file, preview: preview})
            }
            return;
        }

        this.setState({path: file.name, data: file, preview: preview})
    }

    // 上传文件
    upload = () => {
        const data = this.state.data;
        if (!data) {
            console.log('NO file Upload');
            return;
        }
    }

    cancel = () => {
        this.props.closeOverlay();
    }

    render() {
        const {name, path, preview} = this.state
        return (
            <div>
                <h3>Upload Text</h3>
                <div className='row'>
                    <div className='row-input'>
                        <input type='file' accept='text/plain' onChange={this.changePath}/>
                    </div>
                </div>
                <div className='media'>
                    {preview}
                </div>
            </div>
        )
    }
}

const rawContentState = {
    "entityMap": {
        "0": {
            "type": "IMAGE",
            "mutability": "MUTABLE",
            "data": {"src": "http://i.imgur.com/aMtBIep.png", "height": "auto", "width": "100%"}
        }
    },
    "blocks": [{
        "key": "9unl6",
        "text": "",
        "type": "unstyled",
        "depth": 0,
        "inlineStyleRanges": [],
        "entityRanges": [],
        "data": {}
    }, {
        "key": "95kn",
        "text": " ",
        "type": "atomic",
        "depth": 0,
        "inlineStyleRanges": [],
        "entityRanges": [{"offset": 0, "length": 1, "key": 0}],
        "data": {}
    }, {
        "key": "7rjes",
        "text": "",
        "type": "unstyled",
        "depth": 0,
        "inlineStyleRanges": [],
        "entityRanges": [],
        "data": {}
    }]
};

class Wysiwyg extends Component {
    state = {
        editorContent: undefined,
        contentState: rawContentState,
        editorState: '',
    };

    onEditorChange = (editorContent) => {
        this.setState({
            editorContent,
        });
    };

    clearContent = () => {
        this.setState({
            contentState: '',
        });
    };

    onContentStateChange = (contentState) => {
        console.log('contentState', contentState);
    };

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };

    imageUploadCallBack = file => new Promise(
        (resolve, reject) => {
            const xhr = new XMLHttpRequest(); // eslint-disable-line no-undef
            xhr.open('POST', 'https://api.imgur.com/3/image');
            xhr.setRequestHeader('Authorization', 'Client-ID 8d26ccd12712fca');
            const data = new FormData(); // eslint-disable-line no-undef
            data.append('image', file);
            xhr.send(data);
            xhr.addEventListener('load', () => {
                const response = JSON.parse(xhr.responseText);
                resolve(response);
            });
            xhr.addEventListener('error', () => {
                const error = JSON.parse(xhr.responseText);
                reject(error);
            });
        }
    );

    render() {
        const {editorContent, editorState} = this.state;
        return (
            <div className="gutter-example button-demo">
                <Row gutter={16}>
                    <Col className="gutter-row" md={24}>
                        <div className="gutter-box">
                            <Card title="Rich text editor" bordered={false}>
                                <Editor
                                    editorState={editorState}
                                    toolbarClassName="home-toolbar"
                                    wrapperClassName="home-wrapper"
                                    editorClassName="home-editor"
                                    onEditorStateChange={this.onEditorStateChange}
                                    toolbar={{
                                        history: {inDropdown: true},
                                        inline: {inDropdown: false},
                                        list: {inDropdown: true},
                                        textAlign: {inDropdown: true},
                                        image: {uploadCallback: this.imageUploadCallBack},
                                    }}
                                    onContentStateChange={this.onEditorChange}
                                    placeholder="Write here"
                                    spellCheck
                                    onFocus={() => {
                                        console.log('focus')
                                    }}
                                    onBlur={() => {
                                        console.log('blur')
                                    }}
                                    onTab={() => {
                                        console.log('tab');
                                        return true;
                                    }}
                                    localization={{locale: 'zh', translations: {'generic.add': 'Test-Add'}}}
                                    mention={{
                                        separator: ' ',
                                        trigger: '@',
                                        caseSensitive: true,
                                        suggestions: [
                                            {text: 'A', value: 'AB', url: 'href-a'},
                                            {text: 'AB', value: 'ABC', url: 'href-ab'},
                                            {text: 'ABC', value: 'ABCD', url: 'href-abc'},
                                            {text: 'ABCD', value: 'ABCDDDD', url: 'href-abcd'},
                                            {text: 'ABCDE', value: 'ABCDE', url: 'href-abcde'},
                                            {text: 'ABCDEF', value: 'ABCDEF', url: 'href-abcdef'},
                                            {text: 'ABCDEFG', value: 'ABCDEFG', url: 'href-abcdefg'},
                                        ],
                                    }}
                                />

                                <style>{`
                                    .home-editor {
                                        min-height: 300px;
                                    }
                                `}</style>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

class page extends React.Component {
    render() {
        return (
            <div className="page" style={{margin: '10px'}}>
                <Row gutter={16}>
                    <Col span={12} style={{background: 'rgba(220, 255, 232, 0.6)'}}>
                        <div style={{overflowY: 'scroll', height: '400px'}}>
                            <Image/>
                        </div>
                    </Col>
                    <Col span={12} style={{background: 'rgba(220, 254, 255, 0.6)'}}>
                        <div style={{overflowY: 'scroll', height: '400px'}}>
                            <Video/>
                        </div>
                    </Col>
                </Row>
                <Row gutter={16} style={{marginTop: '10px'}}>
                    <Col span={10} style={{background: 'rgba(220, 254, 255, 0.6)'}}>
                        <div style={{overflowY: 'scroll', height: '400px'}}>
                            <Texts/>
                        </div>
                    </Col>
                    <Col span={14} style={{background: 'rgba(220, 255, 232, 0.6)'}}>
                        <div style={{overflowY: 'scroll', height: '400px'}}>
                            <Wysiwyg/>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default page;
