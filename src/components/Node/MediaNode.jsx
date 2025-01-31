/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  ArrowRightOutlined,
  CopyOutlined,
  DeleteOutlined,
  DisconnectOutlined,
  FlagOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { Handle, Position } from "@xyflow/react";
import {
  Badge,
  Button,
  Card,
  ConfigProvider,
  Dropdown,
  Flex,
  Image,
  Switch,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
// import {
//   setRichCardNodeData,
//   setUpdateNodeData,
// } from "../redux/reducer.button";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // for basic Swiper styles
import "swiper/css/effect-coverflow"; // for coverflow effect styles
import "swiper/css/pagination"; // for pagination styles
import { EffectCoverflow } from "swiper/modules";
import { setUpdateNodeData } from "../../redux/nodesSlice";

// import { Pagination } from "swiper";
const blinkingBorderStyle = {
  animation: "blink-border 1s infinite",
};
function MediaNode({ data, selected }) {
  const {
    reactFlowWrapper,
    handleDeleteClick,
    createCopyNode,
    edges,
    handleUnsetStart,
    handleSetStart,
  } = data;

  const id = data.id;
  const nodes = useSelector((state) => state.nodes.nodes);
  const alldata = nodes.find((item) => item.id === id);

  const dispatch = useDispatch();
  const { Paragraph } = Typography;
  const [enabled, setEnabled] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isConnectedToStartNode, setIsConnectedToStartNode] = useState(false);
  const [isRightHandleConnected, setIsRightHandleConnected] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const handleSlideClick = (index) => {
    setActiveSlide(index);
  };
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

  const isLastNodeConnect = () => {
    const edgesofCurentNode = edges
      .filter((edge) => edge.target === id)
      .map((item) => item.source);
    // console.log("edgesofCurentNode", edgesofCurentNode);
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

  const checkRightHandleConnected = () => {
    return edges.some(
      (edge) => edge.source === id && edge.sourceHandle === `handle`
    );
  };

  useEffect(() => {
    const connected = checkRightHandleConnected();
    setIsRightHandleConnected(connected);
  }, [edges]);

  const isNodeConnected = (nodeId) => {
    return edges.some(
      (edge) => edge.source === nodeId || edge.target === nodeId
    );
  };

  const connected = isNodeConnected(id);

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
  return (
    <ConfigProvider
      theme={{
        components: {
          Card: {
            headerBg:
              "linear-gradient(to bottom, #878D98 0%, #878D98 70%, rgba(255, 255, 255, 0) 90%, rgba(255, 255, 255, 0) 100%)",
          },
          Typography: {
            fontSize: 12,
          },
          Badge: {
            statusSize: 8,
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
          paddingTop: "1px",
          ...nodeStyle,
        }}
        onMouseEnter={() => {
          if (enabled) setIsHovered(true);
        }}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Card
          styles={{
            body: {
              padding: "0px",
              borderRadius: "14px",
              background: "rgba(255, 255, 255, 0.8)",
              boxShadow: "0px -10px 15px rgba(0, 0, 0, 0.2)",
            },
            header: {
              color: "red",
              textAlign: "center",
              borderRadius: "17px 17px 17px 0",
              padding: "10px",
              border: "none",
            },
          }}
          style={{
            // width: 200,
            padding: "-1px",
            borderRadius: "14px",
            background: "rgba(255, 255, 255, 0.2)",
            paddingTop: "2px",
            boxShadow: selected
              ? "0 1px 10px rgba(64, 150, 255, 0.5)"
              : isConnectedToStartNode
              ? "0 1px 10px rgba(82, 196, 26, 0.5)"
              : "0 1px 10px rgba(0,0,0,0.15)",
            filter: enabled ? "none" : "grayscale(100%) opacity(0.5)",
          }}
        >
          <div className="inverted-border-radius  shadow-green ">
            <Flex className="flex-grow" align="center" justify="space-between">
              <Typography className="title-name" style={{ marginTop: "-18px" }}>
                {alldata?.data?.templateName ?? "Media"}
              </Typography>

              <Flex gap={5} align="center">
                <Switch
                  style={{ marginBottom: "18px" }}
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
                    style={{ marginBottom: "18px" }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </Dropdown>
              </Flex>
            </Flex>
          </div>

          <div className="card-body" style={{ width: 200 }}>
            <Flex
              Direction="column"
              gap={2}
              style={{
                padding: "0",
              }}
            >
              {/* {alldata?.data?.mediaArray?.length > 0 ? (
                alldata?.data?.mediaArray.map((media, index) => (
                  <>
                    <Flex
                      vertical
                      gap={12}
                      style={{
                        width: "50%",
                        // background: "rgba(255, 255, 255, 0.7)",
                        display: "flex",
                        flexDirection: "column",
                        // marginTop: "3px",
                        
                      }}
                    >
                      <Image
                        key={index}
                        src={
                          media.url ||
                          "https://medcities.org/wp-content/uploads/2021/05/generic_image_medcities-1.jpg"
                        }
                        alt={media.name || "media image"}
                        style={{
                          marginTop: "3px",
                          borderRadius: "14px",
                          width: "200px",
                          height: "150px",
                          // objectFit: "cover",
                        }}
                        preview={false}
                      />
                    </Flex>
                  </>
                ))

              ) : (
                <Image
                  src={
                    "https://medcities.org/wp-content/uploads/2021/05/generic_image_medcities-1.jpg"
                  }
                  alt="example"
                  style={{
                    marginTop: "3px",
                    borderRadius: "14px",
                    width: "200px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                  preview={false}
                />
              )} */}

              {alldata?.data?.mediaArray?.length > 0 ? (
              <Swiper
              effect={"coverflow"}
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={3}
              loop={true}
              modules={[EffectCoverflow]}
              pagination={{ clickable: true }}
              coverflowEffect={{
                rotate: 0,
                stretch: 0,
                depth: 120,
                modifier: 2,
                slideShadows: false,
              }}
              className="carousel-container"
              onSlideChange={(swiper) => setActiveSlide(swiper.activeIndex)}
            >
              {alldata?.data?.mediaArray.map((slide, index) => (
                <SwiperSlide
                  key={index}
                  onClick={() => handleSlideClick(index)}
                  style={{
                    cursor: "pointer",
                  
                    width: "  5.6667px", // Set width of each slide
                    transform:
                      activeSlide === index ? "scale(1.1) translateX(-50%)" : "scale(0.9) translateX(0)",
                  }}
                >
                  <img
                    src={slide.url}
                    alt={`Media ${index}`}
                    style={{
                      width: "190px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "14px",
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            
              ) : (
                <Image
                  src={
                    "https://medcities.org/wp-content/uploads/2021/05/generic_image_medcities-1.jpg"
                  }
                  alt="example"
                  style={{
                    marginTop: "3px",
                    borderRadius: "14px",
                    width: "200px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                  preview={false}
                />
              )}
            </Flex>
            <Handle
              type={
                alldata?.data?.isStartNode || data.isStartNode
                  ? "source"
                  : "target"
              }
              position={
                alldata?.data?.isStartNode ? Position.Right : Position.Left
              }
              isConnectable={enabled}
              style={{
                background: "transparent",
                position: "absolute",
                width: "20px",
                left: alldata?.data?.isStartNode ? "auto" : "-8px",
                right: alldata?.data?.isStartNode ? "-6px" : "auto",
                border: "none",
                top: "60%",
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
                top: "-50px",
                // left:"-50.1%",
                // right:"-50.1%",

                left: alldata?.data?.isStartNode ? "auto" : "-50.1%",
                right: alldata?.data?.isStartNode ? "-50.1%" : "null",
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
            </div>
          </div>
        </Card>
      </div>
    </ConfigProvider>
  );
}
export default MediaNode;
