/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from "react";
import {
  Badge,
  Col,
  ConfigProvider,
  Form,
  Input,
  Layout,
  message,
  Row,
  Typography,
  Upload,
} from "antd";
import { DeleteOutlined, EditOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import SideBarHeader from "./components/SideBarHeader";
import { useDispatch, useSelector } from "react-redux";
import { setUpdateNodeData } from "../../redux/nodesSlice";
import { ProLayout } from "@ant-design/pro-components";
import TextEditor from "../Node/Texteditor";

const { Sider } = Layout;
const TextNodeSidebar = ({ setSelectedNode, title, selectedNode }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const nodes = useSelector((state) => state.nodes.nodes);
  const alldata = nodes.find((item) => item.id === selectedNode);
  const { Dragger } = Upload;
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(alldata?.data?.mediaUrl ?? "");
  const [message1, setMessage] = useState(alldata?.data?.label ?? "");
  const [isEditing, setIsEditing] = useState(false);

  const [templateName, setTemplateName] = useState(
    alldata?.data?.templateName ?? ""
  );

  useEffect(() => {
    const alldata = nodes.find((item) => item.id === selectedNode);

    if (alldata) {
      setTemplateName(alldata?.data?.templateName ?? "Text Message");
      setMessage(alldata?.data?.label ?? "");
      setImageUrl(alldata?.data?.mediaUrl ?? "");
    }
  }, [selectedNode, nodes]);

  const handleMessageChange = (value) => {
    const MessageName = value;
    setMessage(MessageName);
    const data = { selectedNode, value, key: "label" };
    dispatch(setUpdateNodeData(data));
  };

  const handleTemplateNameChange = (e) => {
    const value = e.target.value;
    setTemplateName(value);
    const data = { selectedNode, value, key: "templateName" };
    dispatch(setUpdateNodeData(data));
  };

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  const props = {
    name: "file",
    multiple: false,
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        setImageUrl(info.file);
        const value = info.file.response.url;
        const data = { selectedNode, value, key: "mediaUrl" };
        dispatch(setUpdateNodeData(data));
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const customUpload = ({ file, onSuccess, onError }) => {
    setTimeout(() => {
      if (file) {
        onSuccess({ url: URL.createObjectURL(file) });
      } else {
        onError(new Error("Upload failed"));
      }
    }, 1000);
  };
  const inputRef = useRef(null);
  const toggleEditMode = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleDelete = () => {
    setImageUrl(null);

    dispatch(
      setUpdateNodeData({
        selectedNode: selectedNode,
        key: "mediaUrl",
        value: null,
      })
    );
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Form: {
            verticalLabelPadding: "0 0 3px",
            itemMarginBottom: 5,
          },
        },
      }}
    >
      <Form form={form} layout="vertical">
        <Row align="middle" justify="center" gutter={[3, 12]}>
          <Col md={12}>
            <Form.Item>
              <Input
                size="small"
                maxLength={25}
                ref={(input) => (inputRef.current = input?.input || null)}
                placeholder="Enter Template Name"
                value={templateName}
                onChange={handleTemplateNameChange}
                readOnly={!isEditing}
              />
            </Form.Item>
          </Col>
          <Col
            md={2}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              cursor: "pointer",
            }}
            onClick={toggleEditMode}
          >
            <EditOutlined />
          </Col>
          <Col md={10} style={{ paddingRight: "8px" }}>
            <Badge.Ribbon text="Text Message" className="badge">
              <div style={{ width: "100%" }}></div>{" "}
            </Badge.Ribbon>
          </Col>
        </Row>

        {/* <Form.Item label="Template Name">
          <Input
            size="small"
            placeholder="Enter Template Name"
            onChange={handleTemplateNameChange}
            value={templateName}
          />
        </Form.Item> */}
        <Form.Item
          label={
            <>
              Media{" "}
              <Typography.Text type="secondary">(Optional)</Typography.Text>
            </>
          }
          required={false}
        >
          <Dragger {...props} customRequest={customUpload} showUploadList={false}>
            {imageUrl ? (
              <img
                src={imageUrl?.response?.url || imageUrl}
                alt="avatar"
                style={{
                  objectFit: "scale-down",
                  width: "100%",
                  height: 50,
                }}
              />
            ) : (
              uploadButton
            )}
          </Dragger>
          {imageUrl && (
                <DeleteOutlined
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    color: "red",
                    cursor: "pointer",
                  }}
                  onClick={handleDelete} // Delete handler
                />
              )}
        </Form.Item>
        <Form.Item label="Message">
          <TextEditor
            value={message1}
            onChange={(value) => {
              setMessage(value);
              handleMessageChange(value);
            }}
          />
          {/* <TextArea
                rows={4}
                placeholder="Enter Message"
                onChange={handleMessageChange}
                value={message1}
              /> */}
        </Form.Item>
      </Form>
    </ConfigProvider>
    //     </div>
    // )}
    // >

    // </ProLayout>
  );
};
export default TextNodeSidebar;
