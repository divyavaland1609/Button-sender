import React from "react";
import { Handle, Position } from "@xyflow/react";

const CustomNode = ({ data }) => {
  return (
    <div style={{ padding: 10, background: "#9CA8B3", borderRadius: 5 }}>
      <Handle type="target" position={Position.Top} />
      <div style={{ color: "white", textAlign: "center" }}>{data.label}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default CustomNode;
