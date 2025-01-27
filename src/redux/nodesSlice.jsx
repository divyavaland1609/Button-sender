import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  nodes: [],
};

// create slice
export const nodesSlice = createSlice({
  name: "nodes",
  initialState: initialState,
  reducers: {
    setNodesState: (state, action) => {
      const newNode = action.payload;
      const nodeIndex = state.nodes.findIndex((node) => node.id === newNode.id);
      if (nodeIndex === -1) {
        state.nodes.push(newNode);
      } else {
        state.nodes[nodeIndex] = { ...state.nodes[nodeIndex], ...newNode };
      }
    },
    setEdgesState: (state, action) => {
      state.edges = action.payload;
    },
    
    // setNodesState: (state, action) => {
    //   const newNode = action.payload;

    //   // Check if the node already exists in the state
    //   const nodeExists = state.nodes.some((node) => node.id === newNode.id); // Assuming each node has a unique 'id'
    //   if (!nodeExists) {
    //     state.nodes.push(newNode); // Add the new node only if it doesn't exist
    //   } else {
    //     state.nodes = [...state.nodes, newNode];
    //   }
    // },
    setEmptyState: (state) => {
      state.nodes = [];
      state.edges = [];
    },
    // setEmptyState: (state) => {
    //   state.nodes = [];
    // },
    setUpdateNodeData: (state, action) => {
      const { selectedNode, value, key } = action.payload;

      const updatedNodes = state.nodes.map((node) => {
        if (node.id === selectedNode) {
          return {
            ...node,
            data: {
              ...node.data,
              [key]: value,
            },
          };
        }
        return node;
      });

      state.nodes = updatedNodes;
    },
    
    // setUpdateNodeData: (state, action) => {
    //   const { selectedNode, value, key } = action.payload;
    //   console.log("123--->",action.payload);
    //   state.nodes = state.nodes.map((node) => {
    //     return node.id === selectedNode
    //       ? { ...node, data: { ...node.data, [key]: value } }
    //       : node;
    //   });
    // },


    updateNodeDisabledState: (state, action) => {
      const { nodeId, disabled } = action.payload;
      const findConnectedNodes = (id, visited = new Set()) => {
        if (visited.has(id)) return [];
        visited.add(id);

        const directlyConnected = state.edges
          .filter((edge) => edge.source === id)
          .map((edge) => edge.target);

        return directlyConnected.reduce(
          (acc, target) => [...acc, ...findConnectedNodes(target, visited)],
          directlyConnected
        );
      };

      const affectedNodes = [nodeId, ...findConnectedNodes(nodeId)];
      state.nodes = state.nodes.map((node) =>
        affectedNodes.includes(node.id) ? { ...node, disabled } : node
      );
    },

    // setDeleteNodeState: (state, action) => {
    //   state.nodes = state.nodes.filter((node) => node.id !== action.payload);
    // },
    setDeleteNodeState: (state, action) => {
      const nodeId = action.payload;
      state.nodes = state.nodes.filter((node) => node.id !== nodeId);
      state.edges = state.edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      );
    },

  },
});

export const {
  setNodesState,
  setEdgesState,
  setEmptyState,
  setUpdateNodeData,
  updateNodeDisabledState,
  setDeleteNodeState,
} = nodesSlice.actions;
export default nodesSlice.reducer;
