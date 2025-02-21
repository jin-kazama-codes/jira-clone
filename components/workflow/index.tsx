"use client";
import { useWorkflow } from "@/hooks/query-hooks/use-workflow";
import { useCookie } from "@/hooks/use-cookie";
import { recalculateEdges } from "@/utils/helpers";
import React, { useState, useEffect } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  applyNodeChanges,
} from "reactflow";

import "reactflow/dist/style.css";

const Workflow = () => {
  const user = useCookie("user");
  const isAdminOrManager =
    user && (user.role === "admin" || user.role === "manager");

  const {
    data: workflow,
    isLoading,
    isError,
    error,
    updateWorkflow,
  } = useWorkflow();

  const [nodes, setNodes, onNodesChangeBase] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodeId, setNodeId] = useState(1);
  const [nodeName, setNodeName] = useState("");
  const [selectedNode, setSelectedNode] = useState(null); // Tracks the selected node
  const [showModal, setShowModal] = useState(false);
  const [hasAddedNode, setHasAddedNode] = useState(false);
  const [editingNode, setEditingNode] = useState(null);
  const [editingName, setEditingName] = useState("");

  // Store the original edges to detect changes
  const [originalEdges, setOriginalEdges] = useState([]);

  // Handle the nodes change
  const onNodesChange = (changes) => {
    if (!isAdminOrManager) return;
    setNodes((nds) => {
      const updatedNodes = applyNodeChanges(changes, nds); // Apply the node changes
      recalculateEdges(updatedNodes, setEdges); // Recalculate edges after nodes are updated
      return updatedNodes;
    });
  };

  // Detect changes in edges
  const edgesHaveChanged =
    JSON.stringify(edges) !== JSON.stringify(originalEdges);

  useEffect(() => {
    if (workflow) {
      const initialNodes = workflow.nodes.map((node) => ({
        id: node.id,
        position: node.position || { x: 0, y: 0 },
        data: { label: node.data.label },
      }));
      const initialEdges = workflow.edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
      }));

      setNodes(initialNodes);
      setEdges(initialEdges);
      setOriginalEdges(initialEdges); // Store the initial edges

      const maxNodeId = workflow.nodes.length;
      setNodeId(maxNodeId + 1);
    }
  }, [workflow]);

  const addNode = () => setShowModal(true);

  const updateFlow = () => {
    if (!isAdminOrManager) return;
    const reorderedNodes = [...nodes].sort(
      (a, b) => a.position.x - b.position.x
    );
    const nodesWithUpdatedIds = reorderedNodes.map((node, index) => ({
      ...node,
      id: `${index + 1}`,
    }));
    updateWorkflow({ nodes: nodesWithUpdatedIds, edges });
    setOriginalEdges(edges);
    setSelectedNode(null); // Clear the selected node
    setHasAddedNode(false); // Reset the "added node" state
  };

  const handleAddNode = () => {
    if (!isAdminOrManager) return;
    if (nodeName.trim()) {
      const lastNode = nodes.length > 0 ? nodes[nodes.length - 1] : null;
      const newNodePosition = {
        x: lastNode ? lastNode.position.x + 200 : Math.random() * 400, // Place 200px ahead of the last node
        y: 50,
      };

      const newNode = {
        id: `${nodeId}`,
        position: newNodePosition,
        data: { label: nodeName },
      };
      setNodes((nds) => [...nds, newNode]);
      setNodeId((id) => id + 1);
      setNodeName("");
      setShowModal(false);
      setHasAddedNode(true);
    }
  };

  const handleCancel = () => {
    setNodeName("");
    setShowModal(false);
  };

  const onNodeClick = (_, node) => {
    if (!isAdminOrManager) return;
    setSelectedNode(node);
  };

  const onNodeDoubleClick = (_, node) => {
    if (!isAdminOrManager) return;
    setEditingNode(node);
    setEditingName(node.data.label);
  };

  // Update node name
  const handleUpdateNodeName = () => {
    if (editingName.trim() && editingNode) {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === editingNode.id
            ? { ...node, data: { ...node.data, label: editingName.trim() } }
            : node
        )
      );
      setEditingNode(null);
      setEditingName("");
      setHasAddedNode(true);
    }
  };

  const deleteNode = () => {
    if (selectedNode && isAdminOrManager) {
      // Remove the node from the nodes state
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));

      // Remove the corresponding edges that reference this node
      setEdges((eds) =>
        eds.filter(
          (edge) =>
            edge.source !== selectedNode.id && edge.target !== selectedNode.id
        )
      );

      // Automatically connect the neighbors of the deleted node
      const remainingNodes = nodes.filter(
        (node) => node.id !== selectedNode.id
      );
      const updatedEdges = [];

      // Reconnect the remaining nodes
      remainingNodes.forEach((node, index) => {
        if (remainingNodes[index + 1]) {
          updatedEdges.push({
            id: `e${node.id}-${remainingNodes[index + 1].id}`,
            source: node.id,
            target: remainingNodes[index + 1].id,
          });
        }
      });

      setEdges(updatedEdges);
      setSelectedNode(null); // Clear the selected node
      setHasAddedNode(true); // Mark as updated
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError)
    return <div>Error: {error?.message || "Failed to load data"}</div>;

  return (
    <div className="flex h-[90vh] flex-col">
      {isAdminOrManager && (
        <div className="flex items-center justify-between border-b border-gray-300 bg-gray-100 p-4 dark:border-none dark:bg-darkSprint-10">
          <button
            onClick={addNode}
            className="rounded-md bg-button px-4 py-2 text-white hover:bg-buttonHover dark:bg-dark-0"
          >
            Add Workflow
          </button>
          {selectedNode && (
              <button
                onClick={deleteNode}
                className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              >
                Delete Node
              </button>
            )}
          {(edgesHaveChanged || hasAddedNode) && (
            <button
              onClick={updateFlow}
              className="rounded-md bg-button px-4 py-2 text-white hover:bg-buttonHover"
            >
              Update Workflow
            </button>
          )}
        </div>
      )}

      <div className="relative flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={() => {}}
          onNodeClick={onNodeClick}
          onNodeDoubleClick={onNodeDoubleClick}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background color="#aaa" gap={16} />
        </ReactFlow>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center   bg-black bg-opacity-50">
          <div className="rounded-md bg-white p-6 shadow-md dark:bg-darkSprint-20">
            <h2 className="mb-4 text-lg font-semibold dark:text-dark-50">
              Enter Node Name
            </h2>
            <input
              type="text"
              value={nodeName}
              onChange={(e) => setNodeName(e.target.value)}
              placeholder="Node Name"
              className="mb-4 w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-darkSprint-20 dark:bg-darkSprint-30 dark:text-white dark:placeholder:text-darkSprint-50"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCancel}
                className="rounded-md bg-gray-300 px-4 py-2  hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNode}
                className="rounded-md bg-button px-4 py-2 text-white hover:bg-buttonHover dark:bg-dark-0"
              >
                Add Node
              </button>
            </div>
          </div>
        </div>
      )}

      {editingNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-md bg-white p-6 shadow-md">
            <h2 className="mb-4 text-lg font-semibold">Edit Node Name</h2>
            <input
              type="text"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              placeholder="Node Name"
              className="mb-4 w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setEditingNode(null)}
                className="rounded-md bg-gray-300 px-4 py-2 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateNodeName}
                className="rounded-md bg-button px-4 py-2 text-white hover:bg-buttonHover"
              >
                Update Name
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workflow;
