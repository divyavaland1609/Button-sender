import {
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Col,
  ConfigProvider,
  Flex,
  Form,
  Input,
  Row,
  Typography,
  message,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUpdateNodeData } from "../../redux/nodesSlice";
import Dragger from "antd/es/upload/Dragger";

function ListNodeSidebar({ title, setSelectedNode, selectedNode }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const nodes = useSelector((state) => state.nodes.nodes);
  const alldata = nodes.find((item) => item.id === selectedNode);

  const [templateName, setTemplateName] = useState(
    alldata?.data?.templateName ?? " List Menu"
  );
  const [menuTitle, setMenuTitle] = useState(alldata?.data?.menuTitle ?? "");
  const [middleTitle, setMiddleTitle] = useState(
    alldata?.data?.middleTitle ?? ""
  );
  const [footerTitle, setFooterTitle] = useState(
    alldata?.data?.footerTitle ?? ""
  );

  const [data, setData] = useState(() => {
    if (alldata && alldata.data && Array.isArray(alldata.data.actions)) {
      return { actions: alldata.data.actions };
    }
    return {
      actions: [
        {
          id: 0,
          title: "",
          description: "",
        },
      ],
    };
  });

  const [editingCardId, setEditingCardId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [imageUrl, setImageUrl] = useState(alldata?.data?.mediaUrl ?? "");
  const[listTitle,setListTitle]=useState(alldata?.data?.listTitle?? "");
  const [loading] = useState(false);

  useEffect(() => {
    if (alldata) {
      setTemplateName(alldata.data?.templateName ?? "List Message");
      setMiddleTitle(alldata.data?.middleTitle ?? "Menu Middle Title");
      setMenuTitle(alldata.data?.menuTitle ?? "Header Title");
      // setImageUrl(alldata?.data?.imageUrl ?? "");
      setFooterTitle(alldata.data?.footerTitle ?? "Footer Title");
      setListTitle(alldata?.data?.listTitle?? "List");  
      setData({
        actions: Array.isArray(alldata.data?.actions)
          ? alldata.data.actions
          : [
              {
                id: 0,
                title: "",
                description: "",
              },
            ],
      });
    }
  }, [selectedNode, nodes]);

  const handleChange = (index, key, val) => {
    setData((prev) => {
      const updatedActions = [...prev.actions];
      updatedActions[index] = { ...updatedActions[index], [key]: val };
      dispatch(
        setUpdateNodeData({
          selectedNode,
          value: updatedActions,
          key: "actions",
        })
      );
      return { ...prev, actions: updatedActions };
    });
  };

  const addNewCard = () => {
    if (data.actions.length < 11) {
      const newCard = { id: data.actions.length, title: "", description: "" };
      setData((prev) => {
        const updatedActions = [...prev.actions, newCard];
        dispatch(
          setUpdateNodeData({
            selectedNode,
            value: updatedActions,
            key: "actions",
          })
        );
        return { ...prev, actions: updatedActions };
      });
    } else {
      message.warning("Cannot add more than 11 List");
    }
  };

  const deleteCard = (index) => {
    if (data.actions.length > 1) {
      setData((prev) => {
        const updatedActions = prev.actions
          .filter((_, i) => i !== index)
          .map((item, i) => ({ ...item, id: i }));
        dispatch(
          setUpdateNodeData({
            selectedNode,
            value: updatedActions,
            key: "actions",
          })
        );
        return { ...prev, actions: updatedActions };
      });
    } else {
      message.warning("There must be at least one button");
    }
  };
  const inputRef = useRef(null);
  const toggleEditMode = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleTemplateNameChange = (e) => {
    const value = e.target.value;
    setTemplateName(value);
    const data = { selectedNode, value, key: "templateName" };
    dispatch(setUpdateNodeData(data));
  };

  const handleMenuTitleChange = (e) => {
    setMenuTitle(e.target.value);
    const data = { selectedNode, value: e.target.value, key: "menuTitle" };
    dispatch(setUpdateNodeData(data));
  };

  const handleMiddleTitleChange = (e) => {
    setMiddleTitle(e.target.value);
    const data = { selectedNode, value: e.target.value, key: "middleTitle" };
    dispatch(setUpdateNodeData(data));
  };

  const handleFooterTitleChange = (e) => {
    setFooterTitle(e.target.value);
    const data = { selectedNode, value: e.target.value, key: "footerTitle" };
    dispatch(setUpdateNodeData(data));
  };
  const handleListTitleChange = (e) => {
    setListTitle(e.target.value);
    const data = { selectedNode, value: e.target.value, key: "listTitle" };
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
            verticalLabelPadding: "0 0 0px",
            itemMarginBottom: 0,
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
                // onChange={handleTemplateNameChange}
                onChange={(value) => handleTemplateNameChange(value)}
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
          <Col md={10} style={{ paddingRight: "8px" ,paddingTop:"5px"}}>
            <Badge.Ribbon text="List Message" className="badge">
              <div style={{ width: "100%" }}></div>{" "}
            </Badge.Ribbon>
          </Col>
        </Row>
        <Form.Item label="Menu Title">
          <Input
            size="small"
            placeholder="Enter Menu Title"
            value={menuTitle}
            onChange={handleMenuTitleChange}
            // onChange={(e) => setMenuTitle(e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Menu Middle Title">
          <Input
            size="small"
            placeholder="Enter Menu Middle Title"
            value={middleTitle}
            onChange={handleMiddleTitleChange}
            // onChange={(e) => setMiddleTitle(e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Footer Title">
          <Input
            size="small"
            placeholder="Enter Footer Title"
            value={footerTitle}
            onChange={handleFooterTitleChange}
            // onChange={(e) => setFooterTitle(e.target.value)}
          />
        </Form.Item>
        {/* <Form.Item label="List Title">
          <Input
            size="small"
            placeholder="Enter List Title"
            value={listTitle}
            onChange={handleListTitleChange}
            // onChange={(e) => setFooterTitle(e.target.value)}
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

        <Flex justify="space-between" align="center" style={{padding:"14px 0px 8px"}}>
          {/* <Form.Item label="Button Label" /> */}
          <Typography.Text>List</Typography.Text>
          <Button size="small" onClick={addNewCard}>
            <PlusOutlined /> Add
          </Button>
        </Flex>

        {data?.actions?.map((btn, index) => (
          <Card
            key={btn.id}
            style={{ marginTop: 4 }}
            bodyStyle={{ padding: "5px", paddingBottom: "5px" }}
          >
            {editingCardId === btn.id && (
              <DeleteOutlined
                onClick={() => deleteCard(index)}
                style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  color: "red",
                  cursor: "pointer",
                }}
              />
            )}

            {editingCardId !== btn.id ? (
              <>
                <Row justify="space-between" align="middle">
                  <Col>
                    <Button size="small" shape="round">
                      {btn.title || `List ${index + 1}`}
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => setEditingCardId(btn.id)}
                    />
                    <Button
                      type="text"
                      icon={<DeleteOutlined />}
                      danger
                      onClick={() => deleteCard(index)}
                    />
                  </Col>
                </Row>
              </>
            ) : (
              <Form layout="vertical">
                <Row align="middle" justify="space-between">
                  <Col>
                    <Button size="small" shape="round">
                      {btn.title || `List ${index + 1}`}
                    </Button>
                  </Col>
                </Row>
                <Row gutter={[10, 0]}>
                  <Col md={12}>
                    <Form.Item label="Title">
                      <Input
                        size="small"
                        value={btn.title || `List ${index + 1}`}
                        onChange={(e) =>
                          handleChange(index, "title", e.target.value)
                        }
                        placeholder="Enter Title"
                      />
                    </Form.Item>
                  </Col>
                  <Col md={12}>
                    <Form.Item label="Description">
                      <Input
                        size="small"
                        value={btn.description}
                        onChange={(e) =>
                          handleChange(index, "description", e.target.value)
                        }
                        placeholder="Enter Description"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            )}
          </Card>
        ))}
      </Form>
    </ConfigProvider>
  );
}

export default ListNodeSidebar;
