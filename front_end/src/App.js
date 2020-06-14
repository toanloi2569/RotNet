import React, { Component } from "react";
import ReactDOM from "react-dom";
import ImgCrop from "antd-img-crop";
import { Upload, Modal } from "antd";
import "antd/dist/antd.css";
import "./index.css";

class App extends Component {
  state = {
    fileList: [
      {
        uid: "-1",
        name: "image.png",
        status: "done",
        url:"https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
      }
    ],
    previewShow: false,
    previewSrc: null
  };
  getBase64Url = file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  onPreview = async file => {
    let previewSrc = file.url || file.preview;
    if (!previewSrc) previewSrc = await this.getBase64Url(file.originFileObj);
    this.setState({ previewShow: true, previewSrc });
  };
  onCancel = () => {
    this.setState({ previewShow: false });
  };
  onChange = ({ fileList }) => {
    this.setState({ fileList });
    console.log(fileList)
  };

  render() {
    const { fileList, previewShow, previewSrc } = this.state;

    return (
      <>
        <ImgCrop>
          <Upload
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            listType="picture-card"
            fileList={fileList}
            onPreview={this.onPreview}
            onChange={this.onChange}
          >
            {fileList.length < 2 && "+ Upload"}
          </Upload>
        </ImgCrop>
        <Modal visible={previewShow} onCancel={this.onCancel} footer={null}>
          <img src={previewSrc} style={{ maxWidth: "100%" }} alt="preview" />
        </Modal>
      </>
    );
  }
}
export default App;
