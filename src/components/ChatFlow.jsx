import { ProChat } from "@ant-design/pro-chat";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Drawer,
  Flex,
  Input,
  Progress,
  Radio,
  message,
  Row,
  Typography,
} from "antd";
import React, { Fragment, useEffect, useRef, useState } from "react";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  LinkOutlined,
  MessageOutlined,
  PaperClipOutlined,
  PhoneOutlined,
  SendOutlined,
  SyncOutlined,
  UserOutlined,
} from "@ant-design/icons";

const ChatFlow = ({ styles, nodeData, edges }) => {
  const [chats, setChats] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentNodeId, setCurrentNodeId] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  console.log("chats",chats)

  const chatContainerRef = useRef(null);
  useEffect(() => {
    if (nodeData && Array.isArray(nodeData)) {
      const transformedChats = nodeData
        .map((node) => {
          if (node.data && node.data.id) {
            return {
              id: node.data.id,
              content: node.data.label || "",
              type: node.type,
              role: "assistant",
              ...node.data,
            };
          }
          return null;
        })
        .filter(Boolean);
      setChats(transformedChats.slice(0, 1));
      if (transformedChats.length > 0) {
        setCurrentNodeId(transformedChats[0].id);
      }
    }
  }, [nodeData]);

  // useEffect(() => {
  //   if (chatContainerRef.current) {
  //     chatContainerRef.current.scrollTop =
  //       chatContainerRef.current.scrollHeight;
  //   }
  // }, [chats]);

  // Find the next node based on the edges array
  const getNextNode = (currentNodeId, type, handle) => {
    var nextEdge = {};
    if (type === "richcard_carosal" || type === "richcard") {
      nextEdge = edges.find((edge) => edge.sourceHandle === handle);
    } else {
      nextEdge = edges.find((edge) => edge.source === currentNodeId); // Find the edge that starts from the current node
    }
    if (nextEdge) {
      const nextNode = nodeData.find(
        (node) => node.data.id === nextEdge.target
      );
      return nextNode;
    }
    return null;
  };

  const handleOptionChange = (e) => {
    const value = e.target.value;

    if (item?.originData?.allowMultiple) {
      setSelectedOptions((prev) =>
        prev.includes(value)
          ? prev.filter((option) => option !== value)
          : [...prev, value]
      );
    } else {
      // Clear previous selections and set the new single value
      setSelectedOptions([value]);
    }
  };

  // Handle button click to move to the next node
  const handleButtonClick = (buttonTitle, currentNodeId, type, handle) => {
    setChats((prevChats) => [
      ...prevChats,
      {
        id: `button-${Date.now()}`,
        content: `${buttonTitle}`,
        type: "Text",
        role: "user",
      },
    ]);
    
    const nextNode = getNextNode(currentNodeId, type, handle);
    if (nextNode) {
      setCurrentNodeId(nextNode.data.id);

      setChats((prevChats) => [
        ...prevChats,
        {
          id: nextNode.data.id,
          content: nextNode.data.label || "",
          type: nextNode.type,
          role: "assistant",
          ...nextNode.data,
        },
      ]);
    }
  };

  // handle open drawer 

  const handleDrawerOpen = () => {
   const update =  chats?.find((item)=>item?.type==="list");
   console.log("update", update);
   if(update){
    setChats((prev)=>([
      ...prev,{
        ...update,
         drawer:true
      }
    ]))
   }

  };

  const RenderOptions = ({ item }) => {
    if (!item || !item.originData?.answers) return null;

    return item?.originData?.answers?.map(({ value, label }, index) => (
      <Fragment key={index}>
        <Row
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Col>
            {item?.originData?.allowMultiple ? (
              <Checkbox
                value={label}
                checked={selectedOptions.includes(label)}
                onChange={handleOptionChange}
              >
                {value ?? `option-${index + 1}`}
              </Checkbox>
            ) : (
              <Radio
                value={label}
                checked={selectedOptions[0] === label}
                onChange={handleOptionChange}
              >
                {value ?? `option-${index + 1}`}
              </Radio>
            )}
          </Col>
          <Col>
            <Avatar icon={<UserOutlined />} size="small" />
          </Col>
        </Row>
        <Progress
          showInfo={false}
          percent={32}
          strokeColor={selectedOptions.includes(label) ? "#00313e" : "#87d068"}
          strokeWidth={10}
          style={{ marginBottom: "8px" }}
        />
      </Fragment>
    ));
  };
  const handleOpen = () => {
    setOpen(true); 
  };

  const handleClose = () => {
    setOpen(false);
  };

  const renderChatContent = (item) => {
    {
      console.log("type-->", item?.originData?.type);
    }
    switch (item?.originData?.type===undefined ? "list":item?.originData?.type ) {
      case "button":
        return (
          <div className="chat-message button-message">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginBottom: 10,
              }}
              dangerouslySetInnerHTML={{
                __html:
                  item?.originData?.label
                    ?.replace(/<p>/g, "<span>")
                    ?.replace(/<\/p>/g, "</span>") || "message",
              }}
            />
            {item?.originData?.actions ? (
              <>
                {Array.isArray(item?.originData?.actions) &&
                  item.originData.actions.map((btn, i) => (
                    <React.Fragment key={`action-${i}`}>
                      <Button
                        // className="btn"
                        size="small"
                        block
                        type="text"
                        // color="primary"
                        onClick={() =>
                          handleButtonClick(
                            btn.title,
                            item?.originData?.id,
                            item?.originData?.type,
                            `handle-${i}`
                          )
                        }
                      >
                        {btn.type === "quick" && (
                          <Typography.Text>
                            <MessageOutlined /> {btn?.title}
                          </Typography.Text>
                        )}
                        {btn.type === "call" && (
                          <Typography.Text>
                            <PhoneOutlined /> {btn?.title}
                          </Typography.Text>
                        )}
                        {btn.type === "url" && (
                          <Typography.Text>
                            <LinkOutlined /> {btn?.title}
                          </Typography.Text>
                        )}
                        {btn.type === "location" && (
                          <Typography.Text>
                            <EnvironmentOutlined /> {btn?.title}
                          </Typography.Text>
                        )}
                        {btn.type === "calendar" && (
                          <Typography.Text>
                            <CalendarOutlined /> {btn?.title}
                          </Typography.Text>
                        )}
                      </Button>
                      {i < item.originData.actions.length - 1 && (
                        <Divider style={{ margin: "0px" }} />
                      )}
                    </React.Fragment>
                  ))}
              </>
            ) : (
              <Button
                size="small"
                block
                type="text"
                onClick={() =>
                  alert(`Button clicked: ${item?.originData?.content}`)
                }
              >
                <MessageOutlined />
                Default Button
              </Button>
            )}
          </div>
        );
      case "media":
        return (
          <div className="chat-message media-message">
            {console.log("2222-->", item?.originData?.mediaArray)}
            {item?.originData?.mediaArray.map((media, index) => (
              <div key={`media-${index}`}>
                <img
                  src={media.url}
                  alt="custom content"
                  className="chat-image"
                />
              </div>
            ))}
          </div>
        );
      case "poll":
        return (
          <div className="chat-message media-message">
            {/* <Card title={item?.originData?.label} bordered={false}> */}
            <div
              style={{
                padding: "0px 0px 0px 0px",
              }}
              className="message-text"
              dangerouslySetInnerHTML={{
                __html:
                  item?.originData?.question?.replace(/\n/g, "<br/>") ||
                  "question",
              }}
            />
            {item?.originData?.allowMultiple ? (
              <Checkbox.Group style={{ width: "100%" }}>
                <RenderOptions item={item} />
              </Checkbox.Group>
            ) : (
              <Radio.Group
                onChange={handleOptionChange}
                value={selectedOptions[0]}
                style={{ width: "100%" }}
              >
                <RenderOptions item={item} />
              </Radio.Group>
            )}
            {/* </Card> */}
          </div>
        );

      case "Text":
        return (
          <div
            className={`chat-message ${
              item?.originData?.role === "user"
                ? "reply-message"
                : "text-message"
            }`}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
              className="message-text"
              dangerouslySetInnerHTML={{
                __html:
                  item?.originData?.content?.replace(/\n/g, "<br/>") ||
                  "message",
              }}
            />
          </div>
        );

      case "list":
        return (
          <div
            className={`chat-message ${
              item?.originData?.role === "user"
                ? "reply-message"
                : "text-message"
            }`}
          >
            {/* Message Title */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontWeight: "bold",
                lineHeight: "1.2",
              }}
              className="message-text"
              dangerouslySetInnerHTML={{
                __html:
                  item?.originData?.menuTitle?.replace(/\n/g, "<br/>") ||
                  "message",
              }}
            />
            {/* Middle Title */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                lineHeight: "1.2",
              }}
              className="message-text"
              dangerouslySetInnerHTML={{
                __html:
                  item?.originData?.middleTitle?.replace(/\n/g, "<br/>") ||
                  "message",
              }}
            />
            {/* Footer Title */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                lineHeight: "1.2",
              }}
              className="message-text"
              dangerouslySetInnerHTML={{
                __html:
                  item?.originData?.footerTitle?.replace(/\n/g, "<br/>") ||
                  "message",
              }}
            />
            {Array.isArray(item?.originData?.actions) && (
              <Divider style={{ margin: "0px" }} />
            )}
            {/* Button */}
            <div>
              <Button onClick={handleOpen} type="primary">
                Open Drawer
              </Button>
              <button onClick={()=>handleDrawerOpen()}>checked</button>

              {/* Ensure Drawer visibility */}
              <Drawer
                title="Basic Drawer"
                placement="top" // Placement ko change karke "top", "left", "right" try karen
                closable={true}
                onClose={handleClose}
                open={open}
                width={400} // Optional: adjust width if needed
                getContainer={false}
                style={{
                  zIndex: 4050,
                  position: "fixed", // Ensure it stays fixed on screen
                }}
              >
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
              </Drawer>
            </div>
          </div>
        );

      default:
        return (
          <div className="chat-message text-message">
            <p>{item?.originData?.content}</p>
          </div>
        );
    }
  };

  return (
    <div style={{ ...styles, background: "#316FF6" }}>
      <div className="inverted-header-radius">
        <Row align="middle" style={{ padding: "5px" }}>
          <Col md={22} style={{ paddingLeft: "5px" }}>
            <Flex align="center" gap={15}>
              <Badge dot style={{ backgroundColor: "#52c41a" }}>
                <Avatar
                  src="https://via.placeholder.com/40"
                  alt="Bot"
                  style={{ backgroundColor: "#f0f0f0" }}
                />
              </Badge>
              <Flex vertical>
                <Typography.Text style={{ fontWeight: 500, color: "white" }}>
                  Bot
                </Typography.Text>
                <Typography.Text
                  type="secondary"
                  style={{ fontSize: "10px", color: "white" }}
                >
                  Online
                </Typography.Text>
              </Flex>
            </Flex>
          </Col>
          <Col md={2}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <SyncOutlined
                style={{ fontSize: "18px", cursor: "pointer", color: "white" }}
              />
            </div>
          </Col>
        </Row>
        <div
          className="inverted-footer-radius"
          style={{ background: "#316FF6 " }}
        >
          <Row align="middle" gutter={[5, 0]}>
            <Col md={19}>
              <Input
                placeholder="Search..."
                style={{
                  flex: 1,
                  outline: "none",
                  boxShadow: "none",
                  fontSize: "16px",
                  width: "100%",
                }}
              />
            </Col>
            <Col md={5} align="right">
              <PaperClipOutlined
                style={{
                  fontSize: "20px",
                  color: "white",
                  marginRight: "10px",
                  cursor: "pointer",
                }}
              />
              <SendOutlined
                style={{
                  fontSize: "20px",
                  color: "white",
                  cursor: "pointer",
                }}
              />
            </Col>
          </Row>
        </div>
      </div>

        

      <ProChat
        locale="en-US"
        chats={chats}
        onChatsChange={(chats) => {
          console.log("check chats",chats)
          setChats(chats);
        }}
        inputAreaRender={() => {
          return <></>;
        }}
        chatItemRenderConfig={{
          actionsRender: false,
          render: (item) => {
            console.log("item",item)
            // return <div ref={chatContainerRef}>{renderChatContent(item)}</div>;
            return <div>{renderChatContent(item)}</div>;
          },
        }}
      />
    </div>
  );
};
export default ChatFlow;
