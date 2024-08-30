import {
  ReactFlow,
  Controls,
  Background,
  applyEdgeChanges,
  applyNodeChanges,
  addEdge,
  MiniMap,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useState, useCallback, useEffect } from "react";
import "./index.css";

const initialEdges = [
  {
    id: "1-2",
    source: "1",
    target: "2",
    label: "to",
    type: "step",
  },
];

const rfStyle = {
  backgroundColor: "#B8CEFF",
};

const initialNodes = [
  {
    id: "1",
    data: { label: "My Initial Node" },
    position: { x: 250, y: 25 },
  },
  {
    id: "2",
    data: { label: "My Second Node" },
    type: "output",
    position: { x: 100, y: 125 },
  },
];

// we know these
let id = 1;
const getId = () => `node-${id++}`;

function Flow() {
  // we know these
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [nodeName, setNodeName] = useState("");
  // we know these
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  // we know these
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  // we know these
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  // const addNode = () => {
  //   const newNode = {
  //     id: getId(),
  //     data: { label: `Node ${nodes.length + 1}` },
  //     position: { x: Math.random() * 250, y: Math.random() * 250 },
  //   };
  //   setNodes((nds) => [...nds, newNode]);
  // };

  // Add a new node to the flow chart when the button is clicked and set its position to a random location on the canvas area.
  const addNode = useCallback(() => {
    setNodes((nds) => [
      ...nds,
      {
        id: getId(),
        data: { label: nodeName || "Node" },
        position: { x: Math.random() * 250, y: Math.random() * 250 },
      },
    ]);
    setNodeName("");
  }, [setNodes, nodeName]);

  /**
   ** Kinda long but please go through this carefully.
   * Save flow state to session storage on every change to nodes or edges or on initial render only if there is no saved state in session storage yet (e.g. on first visit to the page)
   * or if the saved state is empty (e.g. if the user has cleared their session storage)
   * or if the saved state is not empty but the user has cleared their browser cache since the last visit to the page
   * (e.g. if the user has cleared their browser cache since the last visit to the page)
   */
  const saveFlowState = useCallback(() => {
    sessionStorage.setItem(
      "react-flow-state",
      JSON.stringify({ nodes, edges })
    );
  }, [nodes, edges]);

  // Load flow state from session storage on initial render only
  useEffect(() => {
    const savedState = JSON.parse(sessionStorage.getItem("react-flow-state"));
    if (savedState) {
      setNodes(savedState.nodes || []);
      setEdges(savedState.edges || []);
    }
  }, [setNodes, setEdges]);

  // Save flow state on every change to nodes or edges
  useEffect(() => {
    saveFlowState();
  }, [nodes, edges, saveFlowState]);

  // kinda complex but i've got upto here for now
  return (
    <div style={{ height: "100vh", fontFamily: "Open Sans" }}>
      {/* <button onClick={addNode} style={{ position: "absolute", zIndex: 15 }}>
        Add Node
      </button> */}
      <div className="custom-node-field">
        <p>To remove a node, select the node and press backspace.</p>
        <input
          type="text"
          value={nodeName}
          onChange={(e) => setNodeName(e.target.value)}
          placeholder="Enter node name"
        />
        <button onClick={addNode}>Add Node</button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        style={rfStyle}
        fitView
      >
        <MiniMap />
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default Flow;
