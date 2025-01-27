// import React, { useState } from "react";
// import { useDnD } from "./DnDContext";
// import { Card, Col, Layout, Row, Tooltip, Typography } from "antd";
// import { PlusOutlined } from "@ant-design/icons";
// import image from "../assets/footer-bg-1.png";
// import { ProLayout } from "@ant-design/pro-components";

// const { Sider } = Layout;

// function Sidebar({ collapsed }) {
//   const [_, setType] = useDnD();
//   // const [collapsed, setCollapsed] = useState(false); // State to manage sidebar collapse

//   const onDragStart = (event, nodeType) => {
//     setType(nodeType);
//     event.dataTransfer.effectAllowed = "move";
//   };
//   const cards = [
//     { id: 1, text: "Text", type: "Text", bgColor: "#878D98" },
//     { id: 2, text: "Text With Button", type: "button", bgColor: "#F53F5F" },
//     { id: 3, text: "Poll Message", type: "poll", bgColor: "#FF6F40" },
//     { id: 4, text: "List Message", type: "list", bgColor: "#F2AF41" },
//     { id: 5, text: "Media", type: "media", bgColor: "#38C792" },
//   ];
//   return (
//     // <ProLayout
//     //   theme="light"
//     //   fixSiderbar
//     //   className="custom-prolayout"
//     //   collapsed={collapsed}
//     //   onCollapse={setCollapsed}
//     //   headerRender={false}
//     //   style={{
//     //     height: "100%",
//     //     width: "0px",
//     //   }}
//     //   menuContentRender={() => (
//     //     <div className="pro-sidebar" style={{ height: "100%" }}>
//     //       <br />
//           <Row>
//             {cards.map((card) => (
//               <Col key={card.id} md={24}>
//                 <div
//                   draggable
//                   onDragStart={(event) => onDragStart(event, card.type)}
//                   style={{
//                     display: "flex",
//                     flexDirection: "column",
//                     height: "100%",
//                     // background:"red"
//                   }}
//                 >
//                   <Card
//                     hoverable
//                     style={{
//                       borderRadius: "10px",
//                       boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
//                       transition: "transform 0.2s",
//                       marginBottom: "10px",
//                       display: "flex",
//                       flexDirection: "column",
//                       width: "100%",
//                       border: "none",
//                       height: "100%",
//                     }}
//                     bodyStyle={{
//                       backgroundColor: card.bgColor,
//                       padding: "10px",
//                       borderRadius: "10px",
//                       display: "flex",
//                       flexDirection: "column",
//                       flex: 1,
//                     }}
//                   >
//                     {collapsed ? (
//                        <Tooltip placement="left" title={card.name}>
//                       <PlusOutlined
//                               style={{ fontSize: "30px", color: "black" }}
//                             />
//                      </Tooltip>
//                     ) : (
//                       <>
//                         <Row
//                           align={"middle"}
//                           justify={"start"}
//                           style={{ backgroundColor: card.bgColor }}
//                         >
//                           <div style={{ backgroundColor: card.bgColor }}>
//                             <PlusOutlined
//                               style={{ fontSize: "30px", color: "black" }}
//                             />
//                           </div>
//                           {/* <Row
//                         justify={"center"}
//                         gutter={[16, 24]}
//                         align="middle"
//                         style={{ marginTop: "10px" }}
//                       > */}
//                           <Typography.Text
//                             style={{
//                               paddingLeft: "10px",
//                               backgroundColor: card.bgColor,
//                             }}
//                           >
//                             {card.text}
//                           </Typography.Text>
//                         </Row>
//                       </>
//                     )}
//                   </Card>
//                 </div>
//               </Col>
//             ))}
//           </Row>
//     //     </div>
//     //   )}
//     // />

//     // <Layout>
//     //   <Sider
//     //     width="305px"
//     //     style={{
//     //       backgroundImage: `url(${image})`,
//     //       backgroundSize: "cover",
//     //       height: "99vh",
//     //       overflow: "hidden",
//     //     }}
//     //   >
//     //     <Row gutter={[10, 10]}>
//     //       {cards.map((card) => (
//     //         <Col key={card.id} span={12}>
//     //           <div
//     //             draggable
//     //             onDragStart={(event) => onDragStart(event, card.type)}
//     //           >
//     //             <Card
//     //               style={{
//     //                 borderRadius: "10px",
//     //                 boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
//     //                 transition: "transform 0.2s",
//     //               }}
//     //               bodyStyle={{
//     //                 backgroundColor: card.bgColor,
//     //                 display: "flex",
//     //                 flexDirection: "column",
//     //                 alignItems: "center",
//     //                 padding: "20px",
//     //                 borderRadius: "10px",
//     //               }}
//     //               hoverable
//     //             >
//     //               <Row justify={"center"}>
//     //                 <PlusOutlined
//     //                   style={{ fontSize: "30px", color: "black" }}
//     //                 />
//     //               </Row>
//     //               <Row justify={"center"} gutter={[16, 24]} align="middle">
//     //                 <Typography.Text
//     //                   style={{ textAlign: "center", paddingTop: "10px" }}
//     //                 >
//     //                   {card.text}
//     //                 </Typography.Text>
//     //               </Row>
//     //             </Card>
//     //           </div>
//     //         </Col>
//     //       ))}
//     //     </Row>
//     //   </Sider>
//     // </Layout>
//   );
// }
// export default Sidebar;


import React from "react";
import { Card, Col, Row, Tooltip, Typography } from "antd";
import {
  BarChartOutlined,
  FileImageOutlined,
  FileTextOutlined,
  PlusOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { useDnD } from "./DnDContext";
import { Card, Col, Layout, Row, Tooltip, Typography } from "antd";
import { BarChartOutlined, PlusOutlined } from "@ant-design/icons";
import image from "../assets/footer-bg-1.png";
import { ProLayout } from "@ant-design/pro-components";

const { Sider } = Layout;

function Sidebar({ collapsed }) {
  const [_, setType] = useDnD();
  const onDragStart = (event, nodeType) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const cards = [
    {
      id: 1,
      name: "Text",
      type: "Text",
      twoToneColor: "#878D98",
      bgColor: "#F53F5F",
      icons: (
        <FileTextOutlined
          style={{ fontSize: "20px", backgroundColor: "#F53F5F !important" }}
        />
      ),
    },
    {
      id: 2,
      name: "Button",
      type: "button",
      bgColor: "#878D98",
      icons: <PlusOutlined style={{ fontSize: "20px" }} />,
    },
    {
     
      id: 3,
      text: "Richcard",
      type: "richcard",
      bgColor: "#F2AF41",
      icons: <BarChartOutlined style={{ fontSize: "20px" }} />,
    },
    { id: 4,
      name: "Poll",
      type: "poll",
      bgColor: "#FF6F40",
      icons: <BarChartOutlined style={{ fontSize: "20px" }} />,
    },
    {
      id: 5,
      name: "List/Menu",
      type: "list",
      bgColor: "#F2AF41",
      icons: <UnorderedListOutlined  style={{ fontSize: "20px" }} />,
    },
    {
      id: 6,
      name: "Media",
      type: "media",
      bgColor: "#38C792",
      icons: <FileImageOutlined style={{ fontSize: "20px" }} />,
    },
  ];

  return (
    <Row gutter={[10, 10]}>
      {cards.map((card) => (
        <Col key={card.id} span={24}>
          <div
            draggable
            onDragStart={(event) => onDragStart(event, card.type)}
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <Card
              style={{
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                transition: "transform 0.2s",
                marginBottom: "10px",
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "100%",
              }}
              styles={{
                body: {
                  backgroundColor: card.bgColor,
                  padding: "10px",
                  borderRadius: "10px",
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  justifyContent: "center",
                  textAlign: "center",
                },
              }}
              hoverable
            >
              {collapsed ? (
                <Tooltip placement="left" title={card.name}>
                  <Row justify="center">{card.icons}</Row>
                </Tooltip>
              ) : (
                <>
                  <Row
                    align={"middle"}
                    justify={"start"}
                    style={{ backgroundColor: card.bgColor }}
                  >
                    <div style={{ backgroundColor: card.bgColor }}>
                      {card.icons}
                    </div>
                    <Typography.Text
                      style={{
                        paddingLeft: "10px",
                        backgroundColor: card.bgColor,
                      }}
                    >
                      {card.name}
                    </Typography.Text>
                  </Row>
                </>
              )}
            </Card>
          </div>
        </Col>
      ))}
    </Row>
  );
}
export default Sidebar;






