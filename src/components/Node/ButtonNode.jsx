/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import {
  Badge,
  Button,
  Card,
  ConfigProvider,
  Divider,
  Dropdown,
  Flex,
  Image,
  Switch,
  Typography,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setUpdateNodeData } from "../../redux/nodesSlice";

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
const { Paragraph } = Typography;

const blinkingBorderStyle = {
  animation: "blink-border 1s infinite",
};
const ButtonNode = ({ data, selected }) => {
  console.log("button data-->", data);
  const {
    reactFlowWrapper,
    handleDeleteClick,
    createCopyNode,
    edges,
    handleUnsetStart,
    handleSetStart,
  } = data;

  const dispatch = useDispatch();
  const id = data.id;
  const nodes = useSelector((state) => state.nodes.nodes);
  const alldata = nodes.find((item) => item.id === id);
  const [enabled, setEnabled] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const [isConnectedToStartNode, setIsConnectedToStartNode] = useState(false);
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

  useEffect(() => {
    const connectedToStart = checkParentNodesForStart(id);
    setIsConnectedToStartNode(connectedToStart);
  }, [edges, id]);

  const handleNodeStateChange = (checked) => {
    setEnabled(checked);

    if (data.isStartNode || alldata?.data?.isStartNode) return;

    dispatch(
      setUpdateNodeData({
        selectedNode: id,
        key: "disabled",
        value: !checked,
      })
    );
    data.toggleNodeState(id, checked);
    const connectedNodes = findNodesTillLast(id);
    console.log("Connected Nodes:", connectedNodes);

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
      data.toggleNodeState(node.id, !node.data.disabled); // Disabling the node
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

  const nodeStyle = {
    opacity: alldata?.data?.disabled ? 0.5 : 1,
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

  const isNodeConnected = (nodeId) => {
    return edges.some(
      (edge) => edge.source === nodeId || edge.target === nodeId
    );
  };
  console.log("media data-->", alldata);

  console.log("media data-->", alldata);

  const isConnected = isNodeConnected(id);
  return (
    <ConfigProvider
      theme={{
        components: {
          Card: {
            headerBg: !enabled ? "#f0f0f0" : "#D6D8F7",
            colorBorderSecondary: "#acb2e9",
            lineWidth: 0,
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
      {data.isStartNode && (
        <>
          <Badge className="badge" />
          <Button
            type="text"
            icon={<ArrowRightOutlined className="arrowRightOutlined" />}
            style={{
              marginBottom: "2px",
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
          // paddingTop: "0.1px",
          ...nodeStyle,
        }}
        onMouseEnter={() => {
          if (enabled) setIsHovered(true);
        }}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* <Card
          size="small"
          bodyStyle={{
            padding: "0px",
            borderRadius: "14px",
            background: "rgba(255, 255, 255, 0.8)",
            boxShadow: "0px -10px 15px  rgba(0, 0, 0, 0.2)",
          }}
          headStyle={{
            color: "#fff",
            textAlign: "center",
            borderRadius: "14px 14px 14px 0",
            padding: "10px",
            border: "none",
            marginBottom: "-14px",
          }}
          style={{
            width: 200,
            // padding: "-10px",
            borderRadius: "14px",
            background: "rgba(255, 255, 255, 0.8)",
            boxShadow: selected
              ? "0 1px 10px rgba(64, 150, 255, 0.5)"
              : isConnectedToStartNode
              ? "0 1px 10px rgba(82, 196, 26, 0.5)"
              : "0 1px 10px rgba(0, 0, 0, 0.15)",
            filter: enabled ? "none" : "grayscale(100%) opacity(0.5)",
          }}
        > */}
        <div className="inverted-border-radius  shadow-pink">
          <Flex className="flex-grow" align="center" justify="space-between">
            <Typography className="title-name">
              {alldata?.data?.templateName ?? "Text with Button "}
            </Typography>

            <Flex gap={5} align="center">
              <Switch
                style={{ marginBottom: "0px" }}
                disabled={alldata?.data?.isStartNode && true}
                checked={enabled}
                value={enabled}
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
                  className="more-outlined-icon"
                  onClick={(e) => e.stopPropagation()}
                />
              </Dropdown>
            </Flex>
          </Flex>
        </div>
        <div
          className="card-body"
          style={{
            background: "rgba(255, 255, 255, 0.8)",
            borderRadius: "12px",
            width: "200px",
          }}
        >
          {alldata?.data?.isStartNode || data.isStartNode ? null : (
            <>
              <Handle
                id="123"
                type={"target"}
                position={Position.Left}
                isConnectable={alldata?.data?.disabled ? false : true}
                style={{
                  background: "transparent",
                  position: "absolute",
                  width: "20px",
                  left: "-7px",
                  top: "60%",
                  border: "none",
                  zIndex: 10,
                  transform: "translateY(-50%)",
                }}
              >
                <div
                  style={{
                    height: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {isConnectedToStartNode ? (
                    <Badge status="success" />
                  ) : (
                    <Badge status="processing" />
                  )}
                </div>
              </Handle>
            </>
          )}
          {alldata?.data?.mediaUrl ? (
            <Image
              style={{
                height: "100px",
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
          ) : 
          null}
          <Paragraph
            style={{
              padding: "10px 10px 0px 10px",
              // padding: "8px",
            }}
          >
            <small>
              {alldata?.data?.label?.replace(/\n/g, "<br/>") || "message"}
            </small>
          </Paragraph>

          {alldata?.data?.actions?.length > 0 ? (
            <>
              {alldata?.data?.actions?.map((btn, i) => (
                <React.Fragment key={i}>
                  <Button className="btn" size="small" block type="text">
                    {btn.type === "quick" && (
                      // <Handle
                      //   type="source"
                      //   position={Position.Right}
                      //   isConnectable={true}
                      // />
                      <>
                        <Handle
                          id={`handle${i}`}
                          type={"source"}
                          position={Position.Right}
                          // isConnectable={true}
                          isConnectable={alldata?.data?.disabled ? false : true}
                          style={{
                            background: "transparent",
                            position: "absolute",
                            width: "20px",
                            left: "97%",
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
                            top: "-0px",
                            left: "98%",
                          }}
                        >
                          {data?.isStartNode || alldata?.data?.isStartNode ? (
                            <>
                              {isConnected ? (
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
              ))}
            </>
          ) : (
            <Button className="btn" size="small" type="text" block>
              <Handle
                id={`handle`}
                type={"source"}
                position={Position.Right}
                isConnectable={alldata?.data?.disabled ? false : true}
                style={{
                  background: "transparent",
                  position: "absolute",
                  width: "20px",
                  left: "97%",
                  border: "none",
                  top: "53%",
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
                  top: "0px",
                  left: "79%",
                }}
              >
                {data?.isStartNode || alldata?.data?.isStartNode ? (
                  <>
                    {isConnected ? (
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
      {/* )} */}
    </ConfigProvider>
  );
};
export default ButtonNode;
