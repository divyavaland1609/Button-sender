import React, { useEffect, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import {
  Card,
  Switch,
  Typography,
  Divider,
  ConfigProvider,
  Badge,
  Button,
  Dropdown,
  Flex,
  Image,
  Drawer,
  theme,
} from "antd";
import {
  ArrowRightOutlined,
  CopyOutlined,
  DeleteOutlined,
  DisconnectOutlined,
  FlagOutlined,
  MoreOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { setUpdateNodeData } from "../../redux/nodesSlice";
const { Title, Text } = Typography;
const blinkingBorderStyle = {
  animation: "blink-border 1s infinite",
};
const ListNode = ({ data, selected }) => {
  const {
    reactFlowWrapper,
    handleDeleteClick,
    createCopyNode,
    onLayout,
    edges,
    handleUnsetStart,
    handleSetStart,
    toggleNodeState,
  } = data;
  const id = data.id;
  const dispatch = useDispatch();
  const nodes = useSelector((state) => state.nodes.nodes);
  const alldata = nodes.find((item) => item.id === id);
  const [enabled, setEnabled] = useState(true);
  const [isConnectedToStartNode, setIsConnectedToStartNode] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [open, setOpen] = useState(false);
  const { token } = theme.useToken();
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

  const isNodeConnected = (nodeId) => {
    return edges.some(
      (edge) => edge.source === nodeId || edge.target === nodeId
    );
  };
  console.log("media data-->", alldata);

  const isConnected = isNodeConnected(id);

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

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const containerStyle = {
    position: "relative",
    height: 200,
    padding: 48,
    overflow: "hidden",
    background: token.colorFillAlter,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
  };
  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Divider: {
              lineWidth: 1,
              colorSplit: "rgba(0,0,0,0.35)",
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

        {/* {alldata?.data?.isStartNode ? (
          <Badge.Ribbon
            text={<div className="flex justify-start m-1">Start</div>}
            placement="start"
            style={{ marginTop: -30 }}
          >
            <Card
              title={alldata?.data?.templateName ?? "List Menu"}
              extra={
                <Switch
                  size="small"
                  disabled={alldata?.data?.isStartNode && true}
                  checked={enabled}
                  value={enabled}
                  onChange={() => setEnabled(!enabled)}
                />
              }
              size="small"
              bodyStyle={{ padding: "10px" }}
              style={{
                width: 200,
                padding: "0px",
                borderRadius: 10,
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                border: selected ? "1px solid#e6eaf7" : "none",
              }}
            >
              <Typography>
                <Title level={5} style={{ margin: "0px" }}>
                  {alldata?.data?.menuTitle ?? "Header Title"}
                </Title>
                <Text>{alldata?.data?.middleTitle ?? "Menu Middle Title"}</Text>
                <br />
                <Text
                  type="secondary"
                  style={{ display: "block", marginBottom: 12 }}
                >
                  {alldata?.data?.footerTitle ?? "Footer Title"}
                </Text>
                <Divider style={{ margin: "5px" }} />
                {alldata?.data?.actions?.map((action, i) => (
                  <>
                    <Text
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        fontSize: 16,
                      }}
                    >
                      <UnorderedListOutlined style={{ marginRight: 8 }} />
                      {action.title ?? "Select"}
                    </Text>
                    {i < alldata?.data?.actions.length - 1 && (
                      <Divider style={{ margin: 5 }} />
                    )}
                  </>
                ))}
              </Typography>
            </Card>
          </Badge.Ribbon>
        ) : ( */}
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
              padding: "-1px",
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
          {/* {enabled && (
              <Handle
                type="target"
                position={Position.Left}
                isConnectable={true}
              />
            )} */}
          <div className="inverted-border-radius shadow-red">
            <Flex className="flex-grow" align="center" justify="space-between">
              <Typography className="title-name">
                {alldata?.data?.templateName ?? "List Message"}
              </Typography>

              <Flex gap={5} align="center">
                <Switch
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
              height: "auto",
            }}
          >
            <Handle
              type={
                alldata?.data?.isStartNode || data.isStartNode
                  ? "source"
                  : "target"
              }
              position={
                alldata?.data?.isStartNode ? Position.Right : Position.Left
              }
              isConnectable={true}
              style={{
                background: "transparent",
                position: "absolute",
                width: "20px",
                left: alldata?.data?.isStartNode ? "auto" : "-8px",
                right: alldata?.data?.isStartNode ? "-6px" : "auto",
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
                position: "absolute",
                alignItems: "center",
                justifyContent: "center",
                top: "63%",

                left: alldata?.data?.isStartNode ? "auto" : "-3px",
                right: alldata?.data?.isStartNode ? "-3px" : "auto",
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
            ) : null}
            <Typography>
              <Title
                level={5}
                style={{
                  margin: "0px",
                  padding: "10px 0px 0px 10px",
                }}
              >
                {alldata?.data?.menuTitle ?? "Header Title"}
              </Title>
              <Text
                style={{
                  paddingLeft: "10px",
                }}
              >
                {alldata?.data?.middleTitle ?? "Menu Middle Title"}
              </Text>
              <br />
              <Text
                type="secondary"
                style={{
                  display: "block",
                  padding: "0px 0px 0px 10px",
                }}
              >
                {alldata?.data?.footerTitle ?? "Footer Title"}
              </Text>

              <Button onClick={showDrawer} type="text" block>
                <UnorderedListOutlined />
                {alldata?.data?.listTitle ?? "List"}
              </Button>
              <Drawer
                title={alldata?.data?.listTitle ?? "List"}
                placement="bottom"
                open={open}
                onClose={onClose}
                mask={false}
                getContainer={false}
                
              >
                {alldata?.data?.actions?.map((action, i) => (
                  <div key={i}>
                    <Text
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        fontSize: "11px",
                      }}
                    >
                      {action.title || `List ${i + 1}`}
                    </Text>
                    {i < alldata?.data?.actions.length - 1 && (
                      <Divider style={{ margin: 5 }} />
                    )}
                  </div>
                ))}
              </Drawer>

              {/* <Drawer
                title="Basic Drawer"
                placement="bottom"
                closable={true}
                onClose={onClose}
                open={open}
                getContainer={false}
              >
                <p>Some contents...</p>
              </Drawer> */}

              {/* {alldata?.data?.actions?.map((action, i) => (
                <>
                  <Text
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      fontSize: "11px",
                    }}
                  >
                    <UnorderedListOutlined style={{ marginRight: 8 }} />
                    {action.title ?? "Select"}
                  </Text>
                  {i < alldata?.data?.actions.length - 1 && (
                    <Divider style={{ margin: 5 }} />
                  )}
                </>
              ))} */}
            </Typography>
          </div>
          {/* </Card> */}
        </div>
        {/* )} */}
      </ConfigProvider>
    </>
  );
};

export default ListNode;
