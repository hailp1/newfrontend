import React, { useEffect, useRef } from 'react';
import { DataSet } from 'vis-data';
import { Network } from 'vis-network';

interface ResearchNetworkGraphProps {
  data?: {
    nodes: Array<{
      id: string;
      label: string;
      group?: string;
    }>;
    edges: Array<{
      from: string;
      to: string;
      label?: string;
    }>;
  };
}

const ResearchNetworkGraph: React.FC<ResearchNetworkGraphProps> = ({ data }) => {
  const networkRef = useRef<HTMLDivElement>(null);
  const networkInstance = useRef<Network | null>(null);

  useEffect(() => {
    if (!networkRef.current) return;

    // Default data if none provided
    const defaultData = {
      nodes: [
        { id: '1', label: 'Research Topic', group: 'topic' },
        { id: '2', label: 'Methodology', group: 'method' },
        { id: '3', label: 'Data Collection', group: 'data' },
        { id: '4', label: 'Analysis', group: 'analysis' },
        { id: '5', label: 'Results', group: 'results' }
      ],
      edges: [
        { from: '1', to: '2', label: 'uses' },
        { from: '2', to: '3', label: 'requires' },
        { from: '3', to: '4', label: 'feeds' },
        { from: '4', to: '5', label: 'produces' }
      ]
    };

    const graphData = data || defaultData;

    // Create datasets
    const nodes = new DataSet(graphData.nodes);
    const edges = new DataSet(graphData.edges);

    // Network options
    const options = {
      nodes: {
        shape: 'dot',
        size: 20,
        font: {
          size: 14,
          color: '#000000'
        },
        borderWidth: 2,
        shadow: true
      },
      edges: {
        width: 2,
        color: { inherit: 'from' },
        smooth: {
          type: 'continuous'
        }
      },
      physics: {
        stabilization: { iterations: 200 }
      },
      interaction: {
        tooltipDelay: 200,
        hideEdgesOnDrag: true
      }
    };

    // Create network
    const network = new Network(networkRef.current, { nodes, edges }, options);
    networkInstance.current = network;

    // Cleanup
    return () => {
      if (networkInstance.current) {
        networkInstance.current.destroy();
        networkInstance.current = null;
      }
    };
  }, [data]);

  return (
    <div className="w-full h-96 border border-gray-300 rounded-lg">
      <div ref={networkRef} className="w-full h-full" />
    </div>
  );
};

export default ResearchNetworkGraph;
