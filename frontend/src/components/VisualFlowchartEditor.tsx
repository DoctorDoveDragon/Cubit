import React, { useState, useCallback } from 'react';
import ReactFlow, { Node, Edge, addEdge, Connection, useNodesState, useEdgesState } from 'reactflow';
import 'reactflow/dist/style.css';
import Button from './Button';
import { executeCode, ExecuteResponse } from '../utils/api';

interface FlowchartNode extends Node {
  data: {
    label: string;
    code?: string;
  };
}

const VisualFlowchartEditor: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<FlowchartNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<FlowchartNode | null>(null);
  const [output, setOutput] = useState<string>('');

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addNode = () => {
    const newNode: FlowchartNode = {
      id: `node-${nodes.length + 1}`,
      type: 'default',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: `Node ${nodes.length + 1}`, code: '' },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const onNodeClick = (_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node as FlowchartNode);
  };

  const updateNodeCode = (code: string) => {
    if (selectedNode) {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === selectedNode.id
            ? { ...node, data: { ...node.data, code } }
            : node
        )
      );
    }
  };

  const runFlowchart = async () => {
    // Simple execution: concatenate all node code in order
    const code = nodes.map((node) => node.data.code || '').join('\n');
    try {
      const response: ExecuteResponse = await executeCode(code, 'python');
      setOutput(response.output || response.error || 'No output');
    } catch (error) {
      setOutput(`Error: ${error}`);
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          fitView
        />
      </div>
      <div style={{ width: '300px', padding: '20px', borderLeft: '1px solid #ddd' }}>
        <Button onClick={addNode}>Add Node</Button>
        <Button onClick={runFlowchart}>Run Flowchart</Button>
        {selectedNode && (
          <div>
            <h3>Edit Node: {selectedNode.data.label}</h3>
            <textarea
              value={selectedNode.data.code || ''}
              onChange={(e) => updateNodeCode(e.target.value)}
              style={{ width: '100%', height: '200px' }}
            />
          </div>
        )}
        <div>
          <h3>Output:</h3>
          <pre style={{ background: '#f5f5f5', padding: '10px' }}>{output}</pre>
        </div>
      </div>
    </div>
  );
};

export default VisualFlowchartEditor;
