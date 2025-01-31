/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from "react";
import {
  Badge,
  Col,
  ConfigProvider,
  Form,
  Input,
  message,
  Row,
  Upload,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { setUpdateNodeData } from "../../redux/nodesSlice";


const MediaNodeSider = ({ selectedNode }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const nodes = useSelector((state) => state.nodes.nodes);
  const alldata = nodes.find((item) => item.id === selectedNode);
  const { Dragger } = Upload;

  const [loading] = useState(false);
  const [templateName, setTemplateName] = useState(
    alldata?.data?.templateName ?? "Media"
  );
  const [isEditing, setIsEditing] = useState(false);
  const [mediaArray, setMediaArray] = useState(alldata?.data?.mediaArray ?? []);
  const inputRef = useRef(null);

  useEffect(() => {
    const alldata = nodes.find((item) => item.id === selectedNode);

    if (alldata) {
      setTemplateName(alldata?.data?.templateName ?? "Media");
      setMediaArray(alldata?.data?.mediaArray ?? []);
    }
  }, [selectedNode, nodes]);

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

  const handleMediaUpload = ({ file, onSuccess, onError }) => {
    setTimeout(() => {
      if (mediaArray.length >= 10) {
        onError(new Error("Media limit reached"));
        message.error(`You can only upload up to ${10} media items.`);
        return;
      }
  
      if (file) {
        const url = URL.createObjectURL(file);
        const newMedia = { url, name: file.name };
  
        // Update local state
        setMediaArray((prev) => {
          const updatedMediaArray = [...prev, newMedia];
  
          // Update Redux store
          dispatch(
            setUpdateNodeData({
              selectedNode,
              value: updatedMediaArray,
              key: "mediaArray",
            })
          );
  
          return updatedMediaArray;
        });
  
        onSuccess({ url });
        message.success(`${file.name} uploaded successfully.`);
      } else {
        onError(new Error("Upload failed"));
        message.error(`${file.name} upload failed.`);
      }
    }, 1000);
  };

  const handleDelete = (index) => {
    setMediaArray((prev) => {
      const updatedMediaArray = prev.filter((_, i) => i !== index);

      // Update Redux store
      dispatch(
        setUpdateNodeData({
          selectedNode,
          value: updatedMediaArray,
          key: "mediaArray",
        })
      );

      return updatedMediaArray;
    });

    message.success("Media deleted successfully.");
  };

  const toggleEditMode = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
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
        <Row align="middle" justify="center">
          <Col md={15}>
            <Form.Item>
              <Input
                size="small"
                ref={(input) => (inputRef.current = input?.input || null)}
                placeholder="Enter Template Name"
                value={templateName}
                onChange={handleTemplateNameChange}
                readOnly={!isEditing}
                maxLength={25}
              />
            </Form.Item>
          </Col>
          <Col
            md={4}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            onClick={toggleEditMode}
          >
            <EditOutlined />
          </Col>
          <Col md={5} style={{ paddingRight: "8px" }}>
            <Badge.Ribbon text="Media" className="badge">
              <div style={{ width: "100%" }}></div>{" "}
            </Badge.Ribbon>
          </Col>
        </Row>
        <Row align="middle" justify="space-evenly">
          <Col md={24}>
            <Form.Item label="Media">
              <Dragger
                customRequest={handleMediaUpload}
                showUploadList={false}
                multiple={true}
                style={{ padding: 10 }}
              >
                {uploadButton}
              </Dragger>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  marginTop: 10,
                }}
              >
                {mediaArray.map((media, index) => (
                  <div
                    key={index}
                    style={{
                      position: "relative",
                      width: 110,
                      height: 90,
                    }}
                  >
                    <img
                      src={media.url}
                      alt={media.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <DeleteOutlined
                      style={{
                        position: "absolute",
                        top: 6,
                        right: 6,
                        color: "red",
                        cursor: "pointer",
                      }}
                      onClick={() => handleDelete(index)}
                    />
                  </div>
                ))}
              </div>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </ConfigProvider>
  );
};

export default MediaNodeSider;
