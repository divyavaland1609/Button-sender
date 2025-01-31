import React, { useEffect, useRef, useState } from "react";
import {
  Input,
  Button,
  Layout,
  Row,
  Card,
  Flex,
  Typography,
  ConfigProvider,
  Form,
  Upload,
  Col,
  Select,
  InputNumber,
  DatePicker,
  message,
  Badge,
} from "antd";
import {
  CalendarOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  EnvironmentOutlined,
  LinkOutlined,
  LoadingOutlined,
  MessageOutlined,
  PhoneOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import SideBarHeader from "./components/SideBarHeader";
import { useDispatch, useSelector } from "react-redux";
import { setUpdateNodeData } from "../../redux/nodesSlice";
import { ProFormDatePicker, ProLayout } from "@ant-design/pro-components";
import TextEditor from ".//../Node/Texteditor";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const { Sider } = Layout;
const { Option } = Select;

const ButtonNodeSidebar = ({ title, setSelectedNode, selectedNode }) => {
  const dispatch = useDispatch();
  const nodes = useSelector((state) => state.nodes.nodes);
  const alldata = nodes.find((item) => item.id === selectedNode);
  const [form] = Form.useForm();
  const { Dragger } = Upload;
  const [loading] = useState(false);
  const [imageUrl, setImageUrl] = useState(alldata?.data?.mediaUrl ?? "");
  const [editingCardId, setEditingCardId] = useState(null);

  const handleEditToggle = (id) => {
    setEditingCardId(editingCardId === id ? null : id);
  };
  const [data, setData] = useState({
    actions: alldata?.data?.actions ?? [
      {
        id: 0,
        type: "quick",
        title: "Default button",
        payload: "",
      },
    ],
  });
  const [isEditing, setIsEditing] = useState(false);

  const [message1, setMessage] = useState(alldata?.data?.label ?? "");
  const [templateName, setTemplateName] = useState(
    alldata?.data?.templateName ?? ""
  );

  useEffect(() => {
    const alldata = nodes.find((item) => item.id === selectedNode);
    if (alldata) {
      setTemplateName(alldata?.data?.templateName ?? "Text with Button");
      setMessage(alldata?.data?.label ?? "");
      setImageUrl(alldata?.data?.mediaUrl ?? "");
    }
  }, [selectedNode, nodes]);

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
    if (data.actions.length < 5) {
      setData((prev) => {
        let newType = "quick"; 
        if (prev.actions.length === 3) {
          newType = "call";
        } else if (prev.actions.length === 4) {
          newType = "url"; 
        }
  
        const value = {
          ...prev,
          actions: [
            ...prev.actions,
            {
              id: prev.actions.length,
              type: newType, 
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
      message.warning("Cannot add more than 5 buttons");
    }
  };
  
  // const addNewCard = () => {
  //   if (data.actions.length < 5) {
  //     setData((prev) => {
  //       const value = {
  //         ...prev,
  //         actions: [
  //           ...prev.actions,
  //           {
  //             id: prev.actions.length,
  //             type: "quick",
  //             title: "",
  //             payload: "",
  //           },
  //         ],
  //       };
  //       const data = { selectedNode, value: value.actions, key: "actions" };
  //       dispatch(setUpdateNodeData(data));
  //       return value;
  //     });
  //   } else {
  //     message.warning("Cannot add more than 5 buttons");
  //   }
  // };
  

  // const deleteCard = (index) => {
  //   if (data.actions.length > 1) {
  //     setData((prev) => {
  //       const value = [...prev.actions]
  //         .filter((_, i) => i !== index)
  //         .map((item, i) => ({ ...item, id: i }));
  //       const data = { selectedNode, value, key: "actions" };
  //       dispatch(setUpdateNodeData(data));
  //       return { ...prev, actions: value };
  //     });
  //   } else {
  //     message.warning("Buttons must be greater than 1");
  //   }
  // };


  
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

const quickReplyCount = data.actions.filter(btn => btn.type === "quick").length;
const quickReplyCount1 = data.actions.filter(btn => btn.type === "call").length;
const quickReplyCount2 = data.actions.filter(btn => btn.type === "url").length;

  const selectBefore = (
    <Select defaultValue="http://">
      <Option value="http://">http://</Option>
      <Option value="https://">https://</Option>
    </Select>
  );

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
          <Col md={10}>
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
          <Col md={12} style={{ paddingRight: "8px" }}>
            <Badge.Ribbon text="Text with Button" className="badge">
              <div style={{ width: "100%" }}></div>{" "}
            </Badge.Ribbon>
          </Col>
        </Row>

        <Form.Item
          label={
            <>
              Media{" "}
              <Typography.Text type="secondary">(Optional)</Typography.Text>
            </>
          }
          required={false}
        >
          <Dragger
            {...props}
            customRequest={customUpload}
            showUploadList={false}
          >
            {imageUrl ? (
              <img
                src={imageUrl?.response?.url || imageUrl}
                alt="avatar"
                
                style={{
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
        <Form.Item label="Message" name="label">
          <TextEditor
            className="ql-editor"
            // style={{padding:"0px"}}
            value={message1}
            // value={alldata?.data?.label}
            onChange={(value) => handleMessageChange(value)}
          />
          {/* <TextArea
            rows={4}
            placeholder="Enter Message"
            onChange={handleMessageChange}
            value={message1}
          /> */}
        </Form.Item>
        {/* <br /> */}
        <Flex justify="space-between" align="center">
          {/* <Form.Item label="Button Label" /> */}
          <Typography.Text>Buttons</Typography.Text>
          <Button size="small" onClick={addNewCard}>
            <PlusOutlined /> Add
          </Button>
        </Flex>
        <div style={{ paddingTop: "5px" }}>
          {data?.actions?.map((btn, index, action) => (
            <Card
              key={index}
              title=""
              style={{ marginTop: "5px" }}
              bodyStyle={{ padding: "5px" }}
            >
              {editingCardId === btn.id && (
                <DeleteOutlined
                  onClick={() => deleteCard(index)}
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    color: "red",
                  }}
                />
              )}
              {editingCardId !== btn.id ? (
                <Row align="middle" justify="space-between">
                  <Col>
                    <Button
                      size="small"
                      shape="round"
                      icon={
                        <>
                          {btn?.type === "quick" && <MessageOutlined />}
                          {btn?.type === "call" && <PhoneOutlined />}
                          {btn?.type === "url" && <LinkOutlined />}
                          {btn?.type === "unsubcribe" && (
                            <EnvironmentOutlined />
                          )}
                        </>
                      }
                    >
                      {btn.title || `Default Button`}
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      onClick={() => handleEditToggle(btn.id)}
                      icon={<EditOutlined />}
                      type="text"
                    />
                    <Button
                      style={{ color: "red" }}
                      icon={
                        <DeleteOutlined onClick={() => deleteCard(index)} />
                      }
                      type="text"
                    />
                  </Col>
                </Row>
              ) : (
                <Form layout="vertical">
                  <Row align="middle" justify="space-between">
                    <Col>
                      <Button
                        size="small"
                        shape="round"
                        icon={
                          <>
                            {btn?.type === "quick" && <MessageOutlined />}
                            {btn?.type === "call" && <PhoneOutlined />}
                            {btn?.type === "url" && <LinkOutlined />}
                            {btn?.type === "unsubcribe" && (
                              <EnvironmentOutlined />
                            )}
                            {/* {btn?.type === "calendar" && <CalendarOutlined />} */}
                          </>
                        }
                      >
                        {btn.title || "Default Button"}
                      </Button>
                    </Col>
                  </Row>
                  <Row gutter={[10, 0]}>
                    <Col md={12}>
                      <Form.Item name={`button-type-${index}`} label="Action">
                        <Select
                          size="small"
                          defaultValue="quick"
                          value={btn.type}
                          onChange={(value) =>
                            handleChange(index, "type", value)
                          }
                          style={{ width: "100%" }}
                          options={[
                            { value: "quick", label: "Quick Reply", disabled: quickReplyCount >= 3 },
                            { value: "call", label: "Call Button", disabled: quickReplyCount1 >= 1 },
                            { value: "url", label: "URL Button", disabled: quickReplyCount2 >= 1 },
                            { value: "unsubcribe", label: "UnSubcribe" },
                          ]}
                        />
                      </Form.Item>
                    </Col>
                    <Col md={12}>
                      <Form.Item
                        name={`button-title-${index}`}
                        rules={[
                          {
                            required: true,
                            type: "string",
                            message: "Please enter title",
                          },
                          {
                            max: 25,
                            message: "Title must be within 25 characters",
                          },
                        ]}
                        label="Title"
                        initialValue={btn.title}
                      >
                        <Input
                          size="small"
                          style={{ fontSize: "15px" }}
                          value={btn.title}
                          onChange={(e) =>
                            handleChange(index, "title", e.target.value)
                          }
                          placeholder="Enter Title"
                          maxLength={25}
                        />
                      </Form.Item>
                    </Col>
                    {btn.type === "call" && (
                      <Col md={24}>
                        <Form.Item
                          name={`button-phoneNumber-${index}`}
                          label="Phone Number"
                          rules={[
                            {
                              required: true,
                              type: "string",
                              message: "Please enter Phone Number",
                            },
                          ]}
                          initialValue={btn.phoneNumber}
                        >
                          <PhoneInput
                            country={"in"}
                            isValid={(value, country) => {
                              if (value.match(/12345/)) {
                                return "Invalid value";
                              } else if (value.match(/1234/)) {
                                return false;
                              } else {
                                return true;
                              }
                            }}
                            inputStyle={{
                              width: "100%",
                              background: " #ffffff",
                              borderWidth: "1px",
                              borderStyle: "solid",
                              borderColor: "#d9d9d9",
                              borderRadius: "6px",
                              height: "24px",
                            }}
                            value={btn.phoneNumber}
                            onChange={(phone) =>
                              handleChange(index, "phoneNumber", phone)
                            }
                            placeholder="Enter Phone Number"
                            inputProps={{
                              size: "large",
                              maxLength: 15,
                            }}
                          />
                        </Form.Item>
                      </Col>
                    )}
                    {btn.type === "url" && (
                      <Col md={24}>
                        <Form.Item
                          name={`button-url-${index}`}
                          label="URL"
                          initialValue={btn.payload}
                          rules={[
                            {
                              required: true,
                              message: "URL is required",
                            },
                            {
                              type: "url",
                              message: "Enter a valid URL",
                            },
                          ]}
                        >
                          <Input
                            size="small"
                            // addonBefore={selectBefore}
                            value={btn.payload}
                            onChange={(e) =>
                              handleChange(index, "payload", e.target.value)
                            }
                            placeholder="Enter URL"
                          />
                        </Form.Item>
                      </Col>
                    )}
                    {btn.type === "unsubcribe" && <></>}
                  </Row>
                </Form>
              )}
            </Card>
          ))}
        </div>
      </Form>
    </ConfigProvider>
  );
};
export default ButtonNodeSidebar;
