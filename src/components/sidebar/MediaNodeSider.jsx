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
  Upload,
} from "antd";
import { EditOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import SideBarHeader from "./components/SideBarHeader";
import { useDispatch, useSelector } from "react-redux";
import { setUpdateNodeData } from "../../redux/nodesSlice";
import { ProLayout } from "@ant-design/pro-components";
import TextEditor from "../Node/Texteditor";
const { Sider } = Layout;

const MediaNodeSider = ({ title, setSelectedNode, selectedNode }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const nodes = useSelector((state) => state.nodes.nodes);
  const alldata = nodes.find((item) => item.id === selectedNode);
  const { Dragger } = Upload;
  const [loading] = useState(false);
  const [imageUrl, setImageUrl] = useState(alldata?.data?.mediaUrl ?? "");
  const [message1, setMessage] = useState(alldata?.data?.label ?? "");
  const [templateName, setTemplateName] = useState(
    alldata?.data?.templateName ?? ""
  );

  const [data, setData] = useState({
    actions: alldata?.data?.actions ?? [
      {
        id: 0,
        type: "quick",
        title: "",
        payload: "",
      },
    ],
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const initValues = data?.actions?.reduce((acc, button, i) => {
      acc[`button-type-${i}`] = button.type;
      acc[`button-title-${i}`] = button.title;
      acc[`button-payload-${i}`] = button.payload;
      acc[`button-phoneNumber-${i}`] = button.phoneNumber;
      acc[`button-url-${i}`] = button.url;
      acc[`button-label-${i}`] = button.label;
      acc[`button-latitude-${i}`] = button.latitude;
      acc[`button-longitude-${i}`] = button.longitude;
      acc[`button-startDate-${i}`] = button.startDate;
      acc[`button-endDate-${i}`] = button.endDate;
      acc[`button-description-${i}`] = button.description;
      return acc;
    }, {});
    form.setFieldsValue(initValues);
  }, [data?.actions]);

  const handleChange = (index, key, val) => {
    setData((prev) => {
      const actions = [...prev.actions];
      if (key === "type") {
        actions[index] = { id: index, title: actions[index].title, [key]: val };
      } else {
        actions[index] = { ...actions[index], [key]: val };
      }
      const { actions: value } = { actions };
      const data = { selectedNode, value, key: "actions" };
      dispatch(setUpdateNodeData(data));
      return { ...prev, actions };
    });
  };

  const addNewCard = () => {
    if (data.actions.length < 11) {
      setData((prev) => {
        const value = {
          ...prev,
          actions: [
            ...prev.actions,
            {
              id: prev.actions.length,
              type: "quick",
              title: "",
              payload: "",
            },
          ],
        };
        const data = { selectedNode, value: value.actions, key: "actions" };
        dispatch(setUpdateNodeData(data));
        return value;
      });
    } else {
      message.warning("Cannot add more than 11 buttons");
    }
  };

  const deleteCard = (index) => {
    if (data.actions.length > 1) {
      setData((prev) => {
        const value = [...prev.actions]
          .filter((_, i) => i !== index)
          .map((item, i) => ({ ...item, id: i }));
        const data = { selectedNode, value, key: "actions" };
        dispatch(setUpdateNodeData(data));
        return { ...prev, actions: value };
      });
    } else {
      message.warning("Buttons must be greater than 1");
    }
  };

  const handleTemplateNameChange = (e) => {
    const value = e.target.value;
    setTemplateName(value);
    const data = { selectedNode, value, key: "templateName" };
    dispatch(setUpdateNodeData(data));
  };

  const handleMessageChange = (value) => {
    const MessageName = value;
    setMessage(MessageName);
    const data = { selectedNode, value, key: "label" };
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

  return (
    // <ProLayout
    // collapsedButtonRender={false}
    // fixSiderbar
    // theme="light"
    // siderWidth={260}
    // headerRender={false}
    // collapsed={false}
    // style={{ width: "0px" }}
    // className="custom-prolayout"
    // menuContentRender={() => (
    //   <div className="pro-sidebar">
    //     <SideBarHeader setSelectedNode={setSelectedNode} title={title} />
    //     <br />
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
              maxLength={25}
              ref={(input) => (inputRef.current = input?.input || null)}
              placeholder="Enter Template Name"
              value={templateName || "Media"}
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
        <Col md={7} style={{ paddingRight: "8px" }}>
          <Badge.Ribbon text="Media" className="badge">
            <div style={{ width: "100%" }}></div>{" "}
          </Badge.Ribbon>
        </Col>
      </Row>
   
        <Col md={24}>
          <Form.Item label="Media" required>
            <Dragger {...props} customRequest={customUpload}>
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
          </Form.Item>
        </Col>
        <Form.Item label="Message">
          {/* <TextEditor
            value={message1}
            onChange={(value) => {
              setMessage(value);
              {
                handleMessageChange(value);
              }
            }}
          /> */}
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
    //   ></ProLayout>
  );
};

export default MediaNodeSider;
