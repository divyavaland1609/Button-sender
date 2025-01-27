/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
    ArrowRightOutlined,
    CalendarOutlined,
    CopyOutlined,
    DeleteOutlined,
    DisconnectOutlined,
    EnvironmentOutlined,
    FlagOutlined,
    LinkOutlined,
    MessageOutlined,
    MoreOutlined,
    PhoneOutlined,
  } from "@ant-design/icons";
  import { Handle, Position } from "@xyflow/react";
  import {
    Badge,
    Button,
    Card,
    ConfigProvider,
    Switch,
    Typography,
    Image as Image,
    Flex,
    Space,
    Divider,
    Dropdown,
  } from "antd";
  import React, { useEffect, useState } from "react";
  import { useSelector } from "react-redux";
  import { useDispatch } from "react-redux";
import { setUpdateNodeData } from "../../redux/nodesSlice";
 
  const blinkingBorderStyle = {
    animation: "blink-border 1s infinite",
  };
  function RichcardNode({ data, selected }) {
    const {
      reactFlowWrapper,
      handleDeleteClick,
      createCopyNode,
      edges,
      handleUnsetStart,
      handleSetStart,
    } = data;
    const id = data.id;
    const dispatch = useDispatch();
  
    const nodes = useSelector((state) => state.nodes.nodes);
    const alldata = nodes.find((item) => item.id === id);
    const [enabled, setEnabled] = useState(!alldata?.data?.disabled);
    const [isHovered, setIsHovered] = useState(false);
    const [isConnectedToStartNode, setIsConnectedToStartNode] = useState(false);
    const [isRightHandleConnected, setIsRightHandleConnected] = useState(false);
  
    const { Title, Paragraph, Text, Link } = Typography;
  
    useEffect(() => {
      const connectedToStart = checkParentNodesForStart(id);
      setIsConnectedToStartNode(connectedToStart);
    }, [edges, id]);
  
    const checkParentNodesForStart = (nodeId) => {
      const parentEdges = edges.filter((edge) => edge.target === nodeId);
      if (parentEdges.length === 0) return false;
  
      return parentEdges.some((edge) => {
        const parentNode = nodes.find((node) => node.id === edge.source);
        return (
          parentNode?.data?.isStartNode || checkParentNodesForStart(edge.source)
        );
      });
    };
  
    const handleNodeStateChange = (checked) => {
      setEnabled(checked);
  
      if (data.isStartNode || alldata?.data?.isStartNode) return;
  
      // Dispatch to disable or enable the node
      dispatch(
        setUpdateNodeData({
          selectedNode: id,
          key: "disabled", // This key can be used to set the enabled/disabled state
          value: !checked,
        })
      );
  
      // Logic for removing the image when the node is disabled
      if (!checked) {
        dispatch(
            setUpdateNodeData({
            selectedNode: id,
            key: "mediaUrl", // Set the 'image' field to null when disabling
            value: null,
          })
        );
      }
  
      // Trigger other state changes
      data.toggleNodeState(id, checked);
      const connectedNodes = findNodesTillLast(id);
      // console.log("Connected Nodes:", connectedNodes);
  
      // Disable all the connected nodes
      connectedNodes.forEach((node) => {
        // Dispatch action to disable each connected node
        dispatch(
          setUpdateNodeData({
            selectedNode: node.id,
            key: "disabled",
            value: !node.data.disabled, // Disabling the node
          })
        );
        // Toggle the state of the connected node to 'disabled'
        data.toggleNodeState(node.id, node.data.disabled); // Disabling the node
      });
    };
  
    
  
    const findNodesTillLast = (sourceId, visitedNodes = new Set()) => {
      let connectedNodes = [];
  
      // Prevent visiting the same node again
      if (visitedNodes.has(sourceId)) {
        return connectedNodes; // Return early if the node has already been visited
      }
  
      // Mark this node as visited
      visitedNodes.add(sourceId);
  
      // Find all edges connected to the current sourceId
      const edgesOfCurrentNode = edges.filter((edge) => edge.source === sourceId);
  
      // Loop through all connected edges
      edgesOfCurrentNode.forEach((edge) => {
        // Find the target node connected through the edge
        const nextNode = nodes.find((node) => node.id === edge.target);
  
        if (nextNode) {
          connectedNodes.push(nextNode); // Add connected node to the list
          // Recursively find the next connected nodes
          const nextConnectedNodes = findNodesTillLast(nextNode.id, visitedNodes);
          connectedNodes = [...connectedNodes, ...nextConnectedNodes];
        }
      });
  
      return connectedNodes;
    };
  
    const isNodeConnected = (nodeId) => {
      return edges.some(
        (edge) => edge.source === nodeId || edge.target === nodeId
      );
    };
    const connected = isNodeConnected(id);
  
    const isLastNodeConnect = () => {
      const edgesofCurentNode = edges
        .filter((edge) => edge.target === id)
        .map((item) => item.source);
      const currentEdges = [...new Set(edgesofCurentNode)];
  
      const disabledNodes = nodes
        ?.filter((node) => node.data.disabled === true)
        ?.filter((node) => currentEdges.includes(node.id));
  
      // console.log("isConnected", disabledNodes, currentEdges);
  
      return disabledNodes.length === currentEdges.length &&
        currentEdges.length > 0
        ? true
        : false;
    };
  
    const isConnected = isLastNodeConnect();
    // console.log("isConnected", isConnected);
  
    const nodeStyle = {
      // opacity: isConnected ? 0.5 : 1,
      filter: isConnected ? "grayscale(100%) opacity(0.5)" : "none",
      border: !enabled
        ? "3px solid #D9D9D9"
        : isHovered
        ? "3px solid #4096FF"
        : isConnectedToStartNode
        ? "3px solid #52C41A"
        : "3px solid transparent",
      boxShadow: !enabled
        ? "none"
        : isHovered
        ? "0 0 10px rgba(64, 150, 255, 0.9)"
        : isConnectedToStartNode
        ? "0 0 10px rgba(82, 196, 26, 0.9)"
        : "none",
    };
  
    useEffect(() => {
      if (!isConnected) {
        setEnabled(true);
        dispatch(
            setUpdateNodeData({
            selectedNode: id,
            key: "disabled",
            value: false,
          })
        );
      }
    }, [isConnected, dispatch, id]);
  
    const items = [
      alldata?.data?.isStartNode
        ? {
            key: "unsetStartNode",
            label: (
              <Typography
                onClick={(e) => {
                  e.preventDefault();
                  handleUnsetStart(e, id);
                }}
              >
                <DisconnectOutlined style={{ fontSize: "20px" }} />
                Unset start node
              </Typography>
            ),
          }
        : {
            key: "setStartNode",
            label: (
              <Typography
                onClick={(e) => {
                  e.preventDefault();
                  handleSetStart(e, id);
                }}
              >
                <FlagOutlined style={{ fontSize: "20px" }} />
                Set start node
              </Typography>
            ),
          },
      {
        key: "copy",
        label: (
          <Typography
            onClick={(e) => {
              e.stopPropagation();
              createCopyNode(e, reactFlowWrapper, alldata);
            }}
          >
            <CopyOutlined style={{ fontSize: "20px" }} />
            copy
          </Typography>
        ),
      },
      {
        key: "delete",
        label: (
          <Typography
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(id, data);
            }}
          >
            <DeleteOutlined style={{ fontSize: "20px" }} />
            Delete
          </Typography>
        ),
      },
    ];
  
    // const checkRightHandleConnected = () => {
    //   return edges.some(
    //     (edge) => edge.source === id && edge.sourceHandle === `handle`
    //   );
    // };
  
    // useEffect(() => {
    //   const connected = checkRightHandleConnected();
    //   setIsRightHandleConnected(connected);
    // }, [edges]);
  
    const getCardStyle = () => {
      switch (alldata?.data?.size) {
        case "short":
          return {
            imageWidth: 100,
          };
        case "medium":
          return {
            imageWidth: 120,
          };
        case "tall":
          return {
            imageWidth: 150,
          };
        default:
          return {
            imageWidth: 120,
          };
      }
    };
  
    const cardStyle = getCardStyle();
  
    return (
      <ConfigProvider
        theme={{
          components: {
            Card: {
              headerBg:
                "linear-gradient(to bottom, #F2AF41 0%, #F2AF41 70%, rgba(255, 255, 255, 0) 90%, rgba(255, 255, 255, 0) 100%)",
            },
            Button: {
              textHoverBg: "#ffffff",
              colorBgTextActive: "#ffffff",
              textTextActiveColor: "rgb(47,84,235)",
            },
            Badge: {
              statusSize: 8,
            },
            Typography: {
              fontSize: 12,
            },
            Switch: {
              fontSize: 7,
            },
          },
        }}
      >
        {alldata?.data?.isStartNode && (
          <>
            <Badge className="badge" />
            <Button
              type="text"
              icon={<ArrowRightOutlined className="arrowRightOutlined" />}
              style={{
                marginBottom: "5px",
                border: "1px solid #D9D9D9",
                borderRadius: "20px",
                padding: "6px 12px",
                fontSize: "14px",
                background: "#fff",
                ...blinkingBorderStyle,
              }}
            >
              <Typography.Text>Start</Typography.Text>
            </Button>
          </>
        )}
        <div
          style={{
            borderRadius: "16px",
            paddingTop: "1.4px",
            ...nodeStyle,
          }}
          onMouseEnter={() => {
            if (enabled) setIsHovered(true);
          }}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* <Card
            styles={{
              body: {
                padding: "0px",
                borderRadius: "14px",
                background: "rgba(255, 255, 255, 0.8)",
                boxShadow: "0px -10px 15px  rgba(0, 0, 0, 0.2)",
              },
              header: {
                color: "#fff",
                textAlign: "center",
                borderRadius: "14px 14px 0 0",
                marginBottom: "-14px",
                border: "none",
              },
            }}
            style={{
              width: 200,
              padding: "-1px",
              borderRadius: "14px",
              paddingLeft: "-1px",
              paddingTop: "2px",
              background: "rgba(255, 255, 255, 0.2)",
              boxShadow: selected
                ? "0 1px 10px rgba(64, 150, 255, 0.5)"
                : isConnected
                ? "0 1px 10px rgba(82, 196, 26, 0.5)"
                : "0 1px 10px rgba(0,0,0,0.15)",
              filter: enabled ? "none" : "grayscale(100%) opacity(0.5)",
            }}
          > */}
            <div className="inverted-border-radius  shadow-red" >
              <Flex className="flex-grow" align="center" justify="space-between">
                <Typography className="title-name" style={{ marginTop: "-9px" }}>
                  {alldata?.data?.templateName ?? "Rich Card"}
                </Typography>
  
                <Flex gap={5} align="center">
                  <Switch
                    style={{ marginBottom: "10px" }}
                    checked={enabled}
                    disabled={data.isStartNode || alldata?.data?.isStartNode}
                    onChange={(checked) => handleNodeStateChange(checked)}
                  />
                  <Dropdown
                    menu={{
                      items,
                    }}
                    trigger={["click"]}
                    placement="topLeft"
                  >
                    <MoreOutlined
                      style={{ marginBottom: "7px" }}
                      onClick={(e) => e.stopPropagation()}
                      className="more-outlined-icon"
                    />
                  </Dropdown>
                </Flex>
              </Flex>
            </div>
  
            <div className="card-body" style={{background:"rgba(255, 255, 255, 0.8)",borderRadius:"12px",width:"200px"}}>
              <Image
                style={{
                  height: cardStyle.imageWidth,
                  marginTop: "3px",
                  borderRadius: "14px",
                  objectFit: "cover",
                  width: "200px",
                }}
                src={
                  alldata?.data?.mediaUrl ||
                  "https://medcities.org/wp-content/uploads/2021/05/generic_image_medcities-1.jpg"
                }
                alt="Media not found"
                preview={false}
              />
  
              {alldata?.data?.isStartNode ? null : (
                <>
                  <Handle
                    type={"target"}
                    position={Position.Left}
                    isConnectable={enabled ? true : false}
                    style={{
                      background: "transparent",
                      position: "absolute",
                      width: "20px",
                      left: "-9px",
                      top: "55%",
                      border: "none",
                      zIndex: 10,
                      transform: "translateY(-50%)",
                    }}
                  >
                    <div
                      style={{
                        height: "7px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        left: "-2px",
                      }}
                    >
                      {data?.isStartNode || alldata?.data?.isStartNode ? (
                        <>
                          {connected ? (
                            <Badge status="success" />
                          ) : (
                            <Badge status="processing" />
                          )}
                        </>
                      ) : (
                        <>
                          {isConnectedToStartNode ? (
                            <Badge status="success" />
                          ) : (
                            <Badge status="processing" />
                          )}
                        </>
                      )}
                      {/* {isConnectedToStartNode ? (
                      <Badge status="success" />
                    ) : (
                      <Badge status="processing" />
                    )} */}
                    </div>
                  </Handle>
                </>
              )}
  
              <Space
                direction="vertical"
                style={{ width: "100%", rowGap: "0px" }}
              >
                <Typography
                  style={{
                    fontWeight: 600,
                    fontSize: "11px",
                    paddingLeft: "7px",
                  }}
                >
                  {alldata?.data?.label ?? "Richcard"}
                </Typography>
  
                <Paragraph
                  style={{
                    padding: "0px 7px",
                    lineHeight: "1.00",
                  }}
                >
                  <small
                    dangerouslySetInnerHTML={{
                      __html:
                        alldata?.data?.description
                          ?.trim()
                          ?.replace(/<p>/g, "<span>")
                          ?.replace(/<\/p>/g, "</span>") || "description",
                    }}
                  ></small>
                </Paragraph>
                {/* <Paragraph
                  style={{
                    lineHeight: "1.00",
                    paddingLeft: "10px",
                    padding: "5px",
                  }}
                >
                  <small
                    dangerouslySetInnerHTML={{
                      __html:
                        alldata?.data?.description?.replace(/\n/g, "<br/>") ||
                        "description",
                    }}
                  ></small>
                </Paragraph> */}
              </Space>
              {alldata?.data?.actions?.length > 0 ? (
                alldata.data.actions.map((btn, i) => (
                  <React.Fragment key={i}>
                    <Button className="btn" size="small" block type="text">
                      {btn?.type === "quick" && (
                        <>
                          <Handle
                            id={`handle-${i}`}
                            type={"source"}
                            position={Position.Right}
                            isConnectable={enabled}
                            style={{
                              background: "transparent",
                              position: "absolute",
                              width: "20px",
                              left: "93%",
                              border: "none",
                              top: "52%",
                              height: "50px",
                              zIndex: 10,
                              transform: "translateY(-50%)",
                            }}
                          />
                          <div
                            style={{
                              height: "6px",
                              position: "absolute",
                              top: "-2px",
                              left: "99%",
                            }}
                          >
                            {data?.isStartNode || alldata?.data?.isStartNode ? (
                              <>
                                {connected ? (
                                  <Badge status="success" />
                                ) : (
                                  <Badge status="processing" />
                                )}
                              </>
                            ) : (
                              <>
                                {isConnectedToStartNode ? (
                                  <Badge status="success" />
                                ) : (
                                  <Badge status="processing" />
                                )}
                              </>
                            )}
                            {/* {isConnectedToStartNode ? (
                              <Badge status="success" />
                            ) : (
                              <Badge status="processing" />
                            )} */}
                          </div>
                        </>
                      )}
  
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
                    {i < alldata.data.actions.length - 1 && (
                      <Divider style={{ margin: "0px" }} />
                    )}
                  </React.Fragment>
                ))
              ) : (
                <Button className="btn" size="small" type="text" block>
                  <Handle
                    id={`handle-0`}
  
                    // id={`handle`}
                    type={"source"}
                    position={Position.Right}
                    isConnectable={enabled}
                    style={{
                      background: "transparent",
                      position: "absolute",
                      width: "20px",
                      left: "94%",
                      border: "none",
                      top: "56%",
                      height: "50px",
                      zIndex: 10,
                      transform: "translateY(-50%)",
                    }}
                  />
                  <div
                    style={{
                      height: "6px",
                      display: "flex",
                      position: "relative",
                      alignItems: "center",
                      justifyContent: "center",
                      top: "-1px",
                      left: "80%",
                    }}
                  >
                    {data?.isStartNode || alldata?.data?.isStartNode ? (
                      <>
                        {connected ? (
                          <Badge status="success" />
                        ) : (
                          <Badge status="processing" />
                        )}
                      </>
                    ) : (
                      <>
                        {isConnectedToStartNode ? (
                          <Badge status="success" />
                        ) : (
                          <Badge status="processing" />
                        )}
                      </>
                    )}
                    {/* {isConnectedToStartNode ? (
                      <Badge status="success" />
                    ) : (
                      <Badge status="processing" />
                    )} */}
                  </div>
                  <Typography.Text
                    style={{
                      fontSize: "11px",
                    }}
                  >
                    <MessageOutlined /> Default Button
                  </Typography.Text>
                </Button>
              )}
            </div>
          {/* </Card> */}
        </div>
      </ConfigProvider>
    );
  }
  export default RichcardNode;
  