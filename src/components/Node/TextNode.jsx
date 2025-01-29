// import React, { useState, useEffect } from "react";
// import { Handle, Position } from "@xyflow/react";
// import {
//   Badge,
//   Button,
//   Card,
//   ConfigProvider,
//   Dropdown,
//   Flex,
//   Image,
//   Switch,
//   Typography,
// } from "antd";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   ArrowRightOutlined,
//   CopyOutlined,
//   DeleteOutlined,
//   DisconnectOutlined,
//   FlagOutlined,
//   MoreOutlined,
// } from "@ant-design/icons";
// import { setUpdateNodeData } from "../../redux/nodesSlice";
// const { Paragraph } = Typography;
// const blinkingBorderStyle = {
//   animation: "blink-border 1s infinite",
// };

// const TextNode = ({ data, selected }) => {
//   const {
//     reactFlowWrapper,
//     handleDeleteClick,
//     createCopyNode,
//     handleUnsetStart,
//     edges,
//     handleSetStart,
//   } = data;

//   const id = data.id;
//   const dispatch = useDispatch();
//   const nodes = useSelector((state) => state.nodes.nodes);
//   const alldata = nodes.find((item) => item.id === id);
//   // console.log("alldata",alldata)
//   const [enabled, setEnabled] = useState(!alldata?.data?.disabled);
//   const [isHovered, setIsHovered] = useState(false);
//   const [isConnectedToStartNode, setIsConnectedToStartNode] = useState(false);

//   // Helper function to check connection with start node
//   const checkParentNodesForStart = (nodeId) => {
//     const parentEdges = edges.filter((edge) => edge.target === nodeId);
//     if (parentEdges.length === 0) return false;

//     return parentEdges.some((edge) => {
//       const parentNode = nodes.find((node) => node.id === edge.source);
//       return (
//         parentNode?.data?.isStartNode || checkParentNodesForStart(edge.source)
//       );
//     });
//   };

//   const isNodeConnected = (nodeId) => {
//     return edges.some(
//       (edge) => edge.source === nodeId || edge.target === nodeId
//     );
//   };
//   console.log("media data-->", alldata);

//   console.log("media data-->", alldata);

//   const isConnected = isNodeConnected(id);

//   useEffect(() => {
//     const connectedToStart = checkParentNodesForStart(id);
//     setIsConnectedToStartNode(connectedToStart);
//   }, [id]);

//   const handleNodeStateChange = (checked) => {
//     setEnabled(checked);
//     if (data.isStartNode || alldata?.data?.isStartNode) return;
//     dispatch(
//       setUpdateNodeData({
//         selectedNode: id,
//         key: "disabled",
//         value: !checked,
//       })
//     );
//     data.toggleNodeState(id, checked);
//     const connectedNodes = findNodesTillLast(id);
//     console.log("Connected Nodes:", connectedNodes);
//     connectedNodes.forEach((node) => {
//       dispatch(
//         setUpdateNodeData({
//           selectedNode: node.id,
//           key: "disabled",
//           value: !node.data.disabled,
//         })
//       );
//       data.toggleNodeState(node.id, !node.data.disabled);
//     });
//   };
//   const findNodesTillLast = (sourceId, visitedNodes = new Set()) => {
//     let connectedNodes = [];

//     if (visitedNodes.has(sourceId)) {
//       return connectedNodes;
//     }

//     visitedNodes.add(sourceId);

//     const edgesOfCurrentNode = edges.filter((edge) => edge.source === sourceId);

//     edgesOfCurrentNode.forEach((edge) => {
//       const nextNode = nodes.find((node) => node.id === edge.target);

//       if (nextNode) {
//         connectedNodes.push(nextNode);
//         const nextConnectedNodes = findNodesTillLast(nextNode.id, visitedNodes);
//         connectedNodes = [...connectedNodes, ...nextConnectedNodes];
//       }
//     });

//     return connectedNodes;
//   };

//   const nodeStyle = {
//     opacity: alldata?.data?.disabled ? 0.5 : 1,
//     border: !enabled
//       ? "3px solid #D9D9D9"
//       : isHovered
//       ? "3px solid #4096FF"
//       : isConnectedToStartNode
//       ? "3px solid #52C41A"
//       : "3px solid transparent",
//     boxShadow: !enabled
//       ? "none"
//       : isHovered
//       ? "0 0 10px rgba(64, 150, 255, 0.9)"
//       : isConnectedToStartNode
//       ? "0 0 10px rgba(82, 196, 26, 0.9)"
//       : "none",
//   };

//   const items = [
//     alldata?.data?.isStartNode
//       ? {
//           key: "unsetStartNode",
//           label: (
//             <Typography onClick={(e) => handleUnsetStart(e, id)}>
//               <DisconnectOutlined style={{ fontSize: "20px" }} />
//               Unset start node
//             </Typography>
//           ),
//         }
//       : {
//           key: "setStartNode",
//           label: (
//             <Typography onClick={(e) => handleSetStart(e, id)}>
//               <FlagOutlined style={{ fontSize: "20px" }} />
//               Set start node
//             </Typography>
//           ),
//         },
//     {
//       key: "copy",
//       label: (
//         <Typography
//           onClick={(e) => createCopyNode(e, reactFlowWrapper, alldata)}
//         >
//           <CopyOutlined style={{ fontSize: "20px" }} />
//           Copy
//         </Typography>
//       ),
//     },
//     {
//       key: "delete",
//       label: (
//         <Typography onClick={() => handleDeleteClick(id, data)}>
//           <DeleteOutlined style={{ fontSize: "20px" }} />
//           Delete
//         </Typography>
//       ),
//     },
//   ];

//   return (
//     <ConfigProvider
//       theme={{
//         components: {
//           Badge: {
//             statusSize: 8,
//           },
//           Switch: {
//             fontSize: 7,
//           },
//         },
//       }}
//     >
//       {alldata?.data?.isStartNode && (
//         <>
//           <Badge className="badge" />
//           <Button
//             className="start-node-button"
//             type="text"
//             icon={<ArrowRightOutlined className="arrowRightOutlined" />}
//             style={{
//               marginBottom: "5px",
//               border: "1px solid #D9D9D9",
//               borderRadius: "20px",
//               padding: "6px 12px",
//               fontSize: "14px",
//               background: "#fff",
//               ...blinkingBorderStyle,
//             }}
//           >
//             <Typography.Text>Start</Typography.Text>
//           </Button>
//         </>
//       )}
//       <div
//         style={{
//           borderRadius: "16px",
//           paddingTop: "1.4px",
//           ...nodeStyle,
//         }}
//         onMouseEnter={() => {
//           if (enabled) setIsHovered(true);
//         }}
//         onMouseLeave={() => setIsHovered(false)}
//       >
//         {/* <Card
//           bodyStyle={{
//             padding: "0px",
//             borderRadius: "14px",
//             boxShadow: "0px -10px 15px rgba(0, 0, 0, 0.2)",
//             margin: "0px -1px 0px -1px",
//           }}
//           style={{
//             width: 200,
//             padding: "-1px",
//             borderRadius: "14px",
//             background: "rgba(255, 255, 255, 0.2)",
//             paddingTop: "2px",
//             boxShadow: selected
//               ? "0 1px 10px rgba(64, 150, 255, 0.5)"
//               : isConnectedToStartNode
//               ? "0 1px 10px rgba(82, 196, 26, 0.5)"
//               : "0 1px 10px rgba(0,0,0,0.15)",
//             filter: enabled ? "none" : "grayscale(100%) opacity(0.5)",
//           }}
//         > */}
//         <div className="inverted-border-radius shadow-blue">
//           <Flex className="flex-grow" align="center" justify="space-between">
//             <Typography className="title-name">
//               {alldata?.data?.templateName ?? "Send Message"}
//             </Typography>
//             <Flex gap={5} align="center">
//               <Switch
//                 checked={enabled}
//                 disabled={data.isStartNode || alldata?.data?.isStartNode}
//                 onChange={(checked) => handleNodeStateChange(checked)}
//               />
//               <Dropdown
//                 menu={{ items }}
//                 trigger={["click"]}
//                 placement="topLeft"
//               >
//                 <MoreOutlined
//                   className="more-outlined-icon"
//                   onClick={(e) => e.stopPropagation()}
//                 />
//               </Dropdown>
//             </Flex>
//           </Flex>
//         </div>
//         <div
//           className="card-body"
//           style={{
//             background: "rgba(255, 255, 255, 0.8)",
//             borderRadius: "12px",
//             width: "200px",
//           }}
//         >
//           {alldata?.data?.mediaUrl?(
//                <Image
//                style={{
//                  height: "100px",
//                  marginTop: "3px",
//                  borderRadius: "14px",
//                  objectFit: "cover",
//                  width: "200px",
//                }}
//                src={
//                  alldata?.data?.mediaUrl ||
//                  "https://medcities.org/wp-content/uploads/2021/05/generic_image_medcities-1.jpg"
//                }
//                alt="Media not found"
//                preview={false}
//              />
//              ):null}
//           <Handle
//             type={
//               alldata?.data?.isStartNode || data.isStartNode
//                 ? "source"
//                 : "target"
//             }
//             position={
//               alldata?.data?.isStartNode ? Position.Right : Position.Left
//             }
//             isConnectable={enabled}
//             style={{
//               background: "transparent",
//               position: "absolute",
//               width: "20px",
//               left: alldata?.data?.isStartNode ? "auto" : "-3px",
//               right: alldata?.data?.isStartNode ? "-3px" : "auto",
//               border: "none",
//               top: "58%",
//               height: "50px",
//               zIndex: 10,
//               transform: "translateY(-50%)",
//             }}
//           />
//           <div
//             style={{
//               height: "6px",
//               display: "flex",
//               position: "relative",
//               alignItems: "center",
//               justifyContent: "center",
//               top: "15px",
//               left: alldata?.data?.isStartNode ? "auto" : "-106px",
//               right: alldata?.data?.isStartNode ? "-100px" : "auto",
//             }}
//           >
//             {data?.isStartNode || alldata?.data?.isStartNode ? (
//               <>
//                 {isConnected ? (
//                   <Badge status="success" />
//                 ) : (
//                   <Badge status="processing" />
//                 )}
//               </>
//             ) : (
//               <>
//                 {isConnectedToStartNode ? (
//                   <Badge status="success" />
//                 ) : (
//                   <Badge status="processing" />
//                 )}
//               </>
//             )}
//           </div>
//           <Paragraph
//             style={{
//               lineHeight: "1.00",
//               // paddingLeft: "10px",
//               padding: "5px 5px 20px 5px",
//             }}
//           >
//             <small
//               dangerouslySetInnerHTML={{
//                 __html:
//                   alldata?.data?.label?.replace(/\n/g, "<br/>") || "message",
//               }}
//             ></small>
//           </Paragraph>
//         </div>
//         {/* </Card> */}
//       </div>
//     </ConfigProvider>
//   );
// };
// export default TextNode;

import React, { useState, useEffect } from "react";
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
import { useSelector, useDispatch } from "react-redux";
import {
  ArrowRightOutlined,
  CopyOutlined,
  DeleteOutlined,
  DisconnectOutlined,
  FlagOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { setUpdateNodeData } from "../../redux/nodesSlice";
const { Paragraph } = Typography;
const blinkingBorderStyle = {
  animation: "blink-border 1s infinite",
};

const TextNode = ({ data, selected }) => {
  const {
    reactFlowWrapper,
    handleDeleteClick,
    createCopyNode,
    handleUnsetStart,
    edges,
    handleSetStart,
  } = data;

  const id = data.id;
  const dispatch = useDispatch();
  const nodes = useSelector((state) => state.nodes.nodes);
  const alldata = nodes.find((item) => item.id === id);
  const [enabled, setEnabled] = useState(!alldata?.data?.disabled);
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

  const isNodeConnected = (nodeId) => {
    return edges.some(
      (edge) => edge.source === nodeId || edge.target === nodeId
    );
  };

  const isConnected = isNodeConnected(id);

  useEffect(() => {
    const connectedToStart = checkParentNodesForStart(id);
    setIsConnectedToStartNode(connectedToStart);
  }, [id]);

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
    connectedNodes.forEach((node) => {
      dispatch(
        setUpdateNodeData({
          selectedNode: node.id,
          key: "disabled",
          value: !node.data.disabled,
        })
      );
      data.toggleNodeState(node.id, !node.data.disabled);
    });
  };

  const findNodesTillLast = (sourceId, visitedNodes = new Set()) => {
    let connectedNodes = [];

    if (visitedNodes.has(sourceId)) {
      return connectedNodes;
    }

    visitedNodes.add(sourceId);

    const edgesOfCurrentNode = edges.filter((edge) => edge.source === sourceId);

    edgesOfCurrentNode.forEach((edge) => {
      const nextNode = nodes.find((node) => node.id === edge.target);

      if (nextNode) {
        connectedNodes.push(nextNode);
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
            <Typography onClick={(e) => handleUnsetStart(e, id)}>
              <DisconnectOutlined style={{ fontSize: "20px" }} />
              Unset start node
            </Typography>
          ),
        }
      : {
          key: "setStartNode",
          label: (
            <Typography onClick={(e) => handleSetStart(e, id)}>
              <FlagOutlined style={{ fontSize: "20px" }} />
              Set start node
            </Typography>
          ),
        },
    {
      key: "copy",
      label: (
        <Typography
          onClick={(e) => createCopyNode(e, reactFlowWrapper, alldata)}
        >
          <CopyOutlined style={{ fontSize: "20px" }} />
          Copy
        </Typography>
      ),
    },
    {
      key: "delete",
      label: (
        <Typography onClick={() => handleDeleteClick(id, data)}>
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
            className="start-node-button"
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
        <div className="inverted-border-radius shadow-blue">
          <Flex className="flex-grow" align="center" justify="space-between">
            <Typography className="title-name">
              {alldata?.data?.templateName ?? "Send Message"}
            </Typography>
            <Flex gap={5} align="center">
              <Switch
                checked={enabled}
                disabled={data.isStartNode || alldata?.data?.isStartNode}
                onChange={(checked) => handleNodeStateChange(checked)}
              />
              <Dropdown
                menu={{ items }}
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
          <Handle
            type={alldata?.data?.isStartNode || data.isStartNode ? "source" : "target"}
            position={alldata?.data?.isStartNode ? Position.Right : Position.Left}
            isConnectable={enabled}
            style={{
              background: "transparent",
              position: "absolute",
              width: "20px",
              left: alldata?.data?.isStartNode ? "" : "-3px",
              right: alldata?.data?.isStartNode ? "-8px" : "",
              border: "none",
              top: "73%",
              height: "50px",
              zIndex: 10,
              transform: "translateY(-50%)",
            }}
          />
          <Handle
            type={alldata?.data?.isStartNode || data.isStartNode ? "source" : "target"}
            position={Position.Right}
            isConnectable={enabled}
            style={{
              background: "transparent",
              position: "absolute",
              width: "20px",
              right: "auto",
              left: "auto",
              border: "none",
              top: "58%",
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
              top: "15px",
              left: alldata?.data?.isStartNode ? "auto" : "-102px",
              right: alldata?.data?.isStartNode ? "-100px" : "auto",
            }}
          >
            {data?.isStartNode || alldata?.data?.isStartNode ? (
              <>
                {isConnected ? <Badge status="success" /> : <Badge status="processing" />}
              </>
            ) : (
              <>
                {isConnectedToStartNode ? <Badge status="success" /> : <Badge status="processing" />}
              </>
            )}
          </div>
          <Paragraph
            style={{
              lineHeight: "1.00",
              padding: "5px 5px 20px 5px",
            }}
          >
            <small
              dangerouslySetInnerHTML={{
                __html: alldata?.data?.label?.replace(/\n/g, "<br/>") || "message",
              }}
            ></small>
          </Paragraph>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default TextNode;

