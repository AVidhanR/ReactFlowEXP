import { Handle, Position } from "@xyflow/react";
import "../index.css";

function HomeNode({ data, isConnectable }) {
  return (
    <div className="custom-node-ui">
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        style={{ backgroundColor: "blue" }}
      />
      <div>{data.value}</div>
      <Handle
        type="source"
        position={Position.Right}
        id="b"
        isConnectable={isConnectable}
        style={{ backgroundColor: "green" }}
      />
    </div>
  );
}

export default HomeNode;
