import React, { useEffect, useRef, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Col,
  ConfigProvider,
  Flex,
  Form,
  Input,
  message,
  Row,
  Typography,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { setUpdateNodeData } from "../../redux/nodesSlice";
import TextEditor from "../Node/Texteditor";
import Dragger from "antd/es/upload/Dragger";
const PollNodeSider = ({ title, setSelectedNode, selectedNode }) => {
  const dispatch = useDispatch();
  const nodes = useSelector((state) => state.nodes.nodes);
  const alldata = nodes.find((item) => item.id === selectedNode);

  const [form] = Form.useForm();
  const [checked, setChecked] = useState(alldata?.data?.allowMultiple ?? false);
  const [question, setQuestion] = useState(alldata?.data?.question ?? "");
  const [editingCardId, setEditingCardId] = useState(null);
  const [message1, setMessage] = useState(alldata?.data?.question ?? "");
  const [imageUrl, setImageUrl] = useState(alldata?.data?.mediaUrl ?? "");
  const [loading, setLoading] = useState(false);

  const [templateName, setTemplateName] = useState(
    alldata?.data?.templateName ?? ""
  );
  const [options, setOptions] = useState(
    alldata?.data?.answers ?? [
      { value: "", label: "option0", id: 0 },
      { value: "", label: "option1", id: 1 },
    ]
  );
  const [isEditing, setIsEditing] = useState(false);

  const handleEditToggle = (id) => {
    setEditingCardId(editingCardId === id ? null : id);
  };

  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setChecked(isChecked);
    dispatch(
      setUpdateNodeData({
        selectedNode,
        value: isChecked,
        key: "allowMultiple",
      })
    );
  };

  useEffect(() => {
    const alldata = nodes.find((item) => item.id === selectedNode);
    if (alldata) {
      setTemplateName(alldata.data.templateName ?? "Poll Message");
      setMessage(alldata.data.question ?? "Question");
      setOptions(
        alldata.data.answers || [
          { value: "", label: "option0", id: 0 },
          { value: "", label: "option1", id: 1 },
        ]
      );
    }
  }, [alldata]);

  const handleChange = (index, val) => {
    setOptions((prev) => {
      const updatedOptions = [...prev];
      updatedOptions[index] = { ...updatedOptions[index], value: val };
      dispatch(
        setUpdateNodeData({
          selectedNode,
          value: updatedOptions,
          key: "answers",
        })
      );
      return updatedOptions;
    });
  };

  // const handleTemplateNameChange = (e) => {
  //   const value = e.target.value;
  //   setTemplateName(value);
  //   dispatch(
  //     setUpdateNodeData({
  //       selectedNode,
  //       value,
  //       key: "templateName",
  //     })
  //   );
  // };

  const handleTemplateNameChange = (e) => {
    const value = e.target.value;
    setTemplateName(value);
    const data = { selectedNode, value, key: "templateName" };
    dispatch(setUpdateNodeData(data));
  };

  const handleMessageNameChange = (value) => {
    const MessageName = value;
    setMessage(MessageName);
    const data = { selectedNode, value, key: "label" };
    dispatch(
      setUpdateNodeData({
        selectedNode,
        data,
        value,
        key: "question",
      })
    );
  };

  // const handleQuestionChange = (value) => {
  //   const MessageName = value;
  //   setQuestion(MessageName);
  //   dispatch(
  //     setUpdateNodeData({
  //       selectedNode,
  //       value,
  //       key: "question",
  //     })
  //   );
  // };

  const addNewCard = () => {
    if (options.length < 12) {
      setOptions((prev) => {
        const newOption = {
          value: "",
          label: `option${prev.length}`,
          id: prev.length,
        };
        const updatedOptions = [...prev, newOption];
        dispatch(
          setUpdateNodeData({
            selectedNode,
            value: updatedOptions,
            key: "answers",
          })
        );
        return updatedOptions;
      });
    } else {
      message.warning("Cannot add more than 12 options");
    }
  };

  const deleteCard = (index) => {
    if (options.length > 2) {
      setOptions((prev) => {
        const updatedOptions = prev
          .filter((_, i) => i !== index)
          .map((item, i) => ({ ...item, id: i }));
        dispatch(
          setUpdateNodeData({
            selectedNode,
            value: updatedOptions,
            key: "answers",
          })
        );
        return updatedOptions;
      });
    } else {
      message.warning("At least 2 options are required");
    }
  };
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
            <Badge.Ribbon text="Poll Message" className="badge">
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
        <Form.Item label="Poll Question">
          <TextEditor
            value={message1}
            onChange={(value) => {
              setMessage(value);
              {
                handleMessageNameChange(value);
              }
            }}
          />
          {/* <TextArea
            rows={4}
            placeholder="Enter Poll Question"
            value={question}
            onChange={handleQuestionChange}
          /> */}
        </Form.Item>
        <Flex justify="space-between" align="center">
          {/* <Form.Item label="Button Label" /> */}
          <Checkbox
            checked={checked}
            onChange={handleCheckboxChange}
            style={{ margin: "10px 0" }}
          >
            Allow Multiple
          </Checkbox>
          <Button size="small" onClick={addNewCard}>
            <PlusOutlined /> Add
          </Button>
        </Flex>
        {options.map((option, i) => (
          <Card
            key={option.id}
            bodyStyle={{ padding: "5px" }}
            style={{ marginTop: "5px" }}
          >
            {editingCardId !== option.id ? (
              <Row align="middle" justify="space-between">
                <Col>
                  <Button size="small" shape="round">
                    {option.value || `Option ${i + 1}`}
                  </Button>
                </Col>
                <Col>
                  <Button
                    onClick={() => handleEditToggle(option.id)}
                    icon={<EditOutlined />}
                    type="text"
                  />
                  <Button
                    onClick={() => deleteCard(i)}
                    icon={<DeleteOutlined />}
                    type="text"
                    danger
                  />
                </Col>
              </Row>
            ) : (
              <>
                <Col>
                  <Button size="small" shape="round">
                    {option.value || `Option ${i + 1}`}
                  </Button>
                  <Form.Item label={`Option ${i + 1}`}>
                    <Input
                      placeholder="Enter Poll Answer"
                      value={option.value || `Option ${i + 1}`}
                      onChange={(e) => handleChange(i, e.target.value)}
                    />
                  </Form.Item>
                </Col>
              </>
            )}
          </Card>
        ))}
      </Form>
    </ConfigProvider>
  );
};

export default PollNodeSider;
