import { LeftOutlined } from "@ant-design/icons";
import { Affix, Button, Card, ConfigProvider, Flex, Row, Typography } from "antd";
import React from "react";

const SideBarHeader = ({ setSelectedNode, title }) => {
  return (
    <ConfigProvider
    theme={{
      components: {
        Button: {
          textHoverBg: "#ffffff",
          colorBgTextActive: "#ffffff",
          textTextActiveColor: "rgb(47,84,235)",
        },
      },
    }}
  >
    <Affix offsetTop={1}>
      <Card
        bodyStyle={{ padding: 5 }}
        style={{ width: "100%" }}
        bordered={false}
      >
        <Row>
          <Flex align="center" gap={20}>
            <Button
              type="text"
              icon={<LeftOutlined onClick={() => setSelectedNode(null)} />}
            />

            <Typography.Title level={5} style={{ margin: "0px" }}>
              {title}
            </Typography.Title>
          </Flex>
        </Row>
      </Card>
    </Affix>
  </ConfigProvider>
  );
};

export default SideBarHeader;
