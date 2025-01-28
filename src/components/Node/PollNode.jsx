/* eslint-disable react/prop-types */
import { Handle, Position } from "@xyflow/react";
import {
  Card,
  Radio,
  Progress,
  Typography,
  Space,
  ConfigProvider,
  Avatar,
  Row,
  Col,
  Switch,
  Badge,
  Checkbox,
  Button,
  Flex,
  Dropdown,
  Image,
} from "antd";
import {
  ArrowRightOutlined,
  CopyOutlined,
  DeleteOutlined,
  DisconnectOutlined,
  FlagOutlined,
  MoreOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUpdateNodeData } from "../../redux/nodesSlice";
const { Text, Paragraph } = Typography;

const blinkingBorderStyle = {
  animation: "blink-border 1s infinite",
};

function PollNode({ data, selected }) {
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
  const nodes = useSelector((state) => state.nodes.nodes);
  const alldata = nodes.find((item) => item.id === id);
  const dispatch = useDispatch();

  const [enabled, setEnabled] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isConnectedToStartNode, setIsConnectedToStartNode] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (alldata?.data?.allowMultiple) {
      setSelectedOptions([]);
    } else {
      setSelectedOptions([]);
    }
  }, [alldata?.data?.allowMultiple]);

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

  const handleOptionChange = (e) => {
    const value = e.target.value;

    if (alldata?.data?.allowMultiple) {
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
          Copy
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
  const isNodeConnected = (nodeId) => {
    return edges.some(
      (edge) => edge.source === nodeId || edge.target === nodeId
    );
  };
  console.log("media data-->", alldata);
  const isConnected = isNodeConnected(id);

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

  // if (!isConnected) {
  //   nodeStyle.opacity = 1; // Always fully visible if not connected
  //   nodeStyle.pointerEvents = "auto"; // Allow interactions
  // }
  const RenderOptions = () => {
    return alldata?.data?.answers?.map(({ value, label }, index) => (
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
            {alldata?.data?.allowMultiple ? (
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
    findNodesTillLast(id);
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
      {alldata?.data?.isStartNode && (
        <>
          <Badge className="badge" />
          <Button
            className=""
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
          border: isConnected
            ? "2px solid #52C41A"
            : selected
            ? "2px solid #4096FF"
            : "none",
          ...nodeStyle,
        }}
        onMouseEnter={() => {
          if (enabled) setIsHovered(true);
        }}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* <Card
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
          // padding: "-1px",
          paddingTop:"2px",
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
          <div className="inverted-border-radius shadow-orange">
            <Flex className="flex-grow" align="center" justify="space-between">
              <Typography className="title-name">
                {alldata?.data?.templateName ?? "Poll Message"}
              </Typography>

              <Flex gap={5} align="center">
                <Switch
                  // style={{ marginBottom: "0px" }}
                  checked={enabled}
                  disabled={data.isStartNode || alldata?.data?.isStartNode}
                  onChange={(checked) => handleNodeStateChange(checked)}
                />
                {/* <Switch
                  style={{ marginBottom: "7px" }}
                  checked={enabled}
                  disabled={data.isStartNode || alldata?.data?.isStartNode}
                  onChange={(checked) => handleNodeStateChange(checked)}
                /> */}

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

          <div className="card-body" style={{background:"rgba(255, 255, 255, 0.8)",borderRadius:"12px",width:"200px",}}>
            {/* {alldata?.data?.isStartNode || data.isStartNode ? null : ( */}


            {alldata?.data?.mediaUrl?(
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
             ):null}
            <>
              <Handle
                id="123"
                type={
                  alldata?.data?.isStartNode || data.isStartNode
                    ? "source"
                    : "target"
                }
                position={
                  alldata?.data?.isStartNode ? Position.Right : Position.Left
                }
                isConnectable={true}
                // isConnectable={alldata?.data?.disabled ? false : true}
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
              >
                <div
                  style={{
                    height: "6px",
                    display: "flex",
                    position: "relative",
                    alignItems: "center",
                    justifyContent: "center",
                    top: "20px",
                    left: alldata?.data?.isStartNode ? "auto" : "-1px",
                    right: alldata?.data?.isStartNode ? "-5px" : "auto",
                  }}
                >
                   {data?.isStartNode || alldata?.data?. isStartNode ? (
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
              </Handle>
            </>
            {/* )} */}

            {/* {alldata?.data?.mediaUrl ? (
              <img
                src={alldata?.data?.mediaUrl}
                alt="Node Media"
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "cover",
                  borderRadius: "10px",
                  marginTop: "10px",
                }}
              />
            ) : null} */}

            <Paragraph
              style={{
                lineHeight: "1.00",
                padding:"10px",
                // paddingLeft: "10px",
                // padding: "5px 5px 20px 5px",
              }}
            >
              <small>{alldata?.data?.question ?? "Question"}</small>
            </Paragraph>
            
            <Col span={24}>
              {alldata?.data?.allowMultiple ? (
                <Checkbox.Group style={{ width: "100%" }}>
                  <RenderOptions />
                </Checkbox.Group>
              ) : (
                <Radio.Group
                  onChange={handleOptionChange}
                  value={selectedOptions[0]}
                  style={{ width: "100%" }}
                >
                  <RenderOptions />
                </Radio.Group>
              )}
            </Col>
          </div>
        {/* </Card> */}
      </div>

      {/* {alldata?.data?.isStartNode ? (
        <Badge.Ribbon
          text={<div className="flex justify-start m-1">Start</div>}
          placement="start"
          style={{ marginTop: -30 }}
        >
          <Card
            title={
              <Space>
                <Text strong>{alldata?.data?.templateName ?? "Poll"}</Text>
              </Space>
            }
            size="small"
            bordered={false}
            extra={
              <Switch
                size="small"
                disabled={alldata?.data?.isStartNode && true}
                checked={enabled}
                value={enabled}
                onChange={() => setEnabled(!enabled)}
              />
            }
            style={{
              width: 200,
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              border: selected ? "1px solid#ADB3E8" : "none",
            }}
            bodyStyle={{ padding: "10px" }}
          >
            {alldata?.data?.isStartNode ? (
              <Handle
                type={alldata?.data?.isStartNode ? "source" : "target"}
                position={
                  alldata?.data?.isStartNode ? Position.Right : Position.Left
                }
                isConnectable={true}
              />
            ) : (
              <>
                <Handle
                  type="target"
                  position={Position.Left}
                  isConnectable={true}
                />
                {!enabled && (
                  <Handle
                    type="source"
                    position={Position.Right}
                    isConnectable={true}
                  />
                )}
              </>
            )}
            <Text>{alldata?.data?.question ?? "Question"}</Text>
            <br />
            <Col span={24}>
              {alldata?.data?.allowMultiple ? (
                <Checkbox.Group style={{ width: "100%" }}>
                  <RenderOptions />
                </Checkbox.Group>
              ) : (
                <Radio.Group
                  onChange={handleOptionChange}
                  value={selectedOptions[0]}
                  style={{ width: "100%" }}
                >
                  <RenderOptions />
                </Radio.Group>
              )}
            </Col>
          </Card>
        </Badge.Ribbon>
      ) : (
        <Card
          title={
            <Space>
              <Text strong>{alldata?.data?.templateName ?? "Poll"}</Text>
            </Space>
          }
          size="small"
          bordered={false}
          extra={
            <Switch
              size="small"
              disabled={alldata?.data?.isStartNode && true}
              checked={enabled}
              value={enabled}
              onChange={() => setEnabled(!enabled)}
            />
          }
          style={{
            width: 200,
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            border: selected ? "1px solid#ADB3E8" : "none",
          }}
          bodyStyle={{ padding: "10px" }}
        >
          {enabled && (
            <Handle
              type="target"
              position={Position.Left}
              isConnectable={true}
            />
          )}
          <Text>{alldata?.data?.question ?? "Question"}</Text>
          <br />
          <Col span={24}>
            {alldata?.data?.allowMultiple ? (
              <Checkbox.Group style={{ width: "100%" }}>
                <RenderOptions />
              </Checkbox.Group>
            ) : (
              <Radio.Group
                onChange={handleOptionChange}
                value={selectedOptions[0]}
                style={{ width: "100%" }}
              >
                <RenderOptions />
              </Radio.Group>
            )}
          </Col>
        </Card>
      )} */}
    </ConfigProvider>
  );
}

export default PollNode;
