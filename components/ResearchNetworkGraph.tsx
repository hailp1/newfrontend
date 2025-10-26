// FILE: components/ResearchNetworkGraph.tsx
import React, { useEffect, useRef } from "react";
import { DataSet } from "vis-data";
import { Network } from "vis-network";
import type { Options } from "vis-network";

// Định nghĩa kiểu dữ liệu cho các biến nghiên cứu
interface ResearchVariable {
  construct: string;
  question?: string;
  column?: string;
}

interface ResearchModel {
  independentVars: ResearchVariable[];
  dependentVars: ResearchVariable[];
  mediatorVars: ResearchVariable[];
  moderatorVars: ResearchVariable[];
  controlVars: ResearchVariable[];
}

interface ResearchNetworkGraphProps {
  researchModel: ResearchModel;
}

// ---- [THAY ĐỔI CHÍNH] ----
// Định nghĩa kiểu dữ liệu cho Node và Edge để thay thế 'any'
interface Node {
  id: number;
  label: string;
  group: string;
  title: string;
}

interface Edge {
  id: string;
  from: number;
  to: number | string; // 'to' có thể là một node ID (number) hoặc một edge ID (string)
  arrows?: string;
  color?: { color: string };
  label?: string;
  smooth?: { enabled: boolean; type: string };
  dashes?: boolean | number[];
  width?: number;
}
// -------------------------

const ResearchNetworkGraph: React.FC<ResearchNetworkGraphProps> = ({
  researchModel,
}) => {
  const networkRef = useRef<HTMLDivElement>(null);
  const networkInstance = useRef<Network | null>(null);

  useEffect(() => {
    if (!networkRef.current) return;

    // ---- [THAY ĐỔI CHÍNH] ----
    // Sử dụng kiểu dữ liệu đã định nghĩa thay vì 'any'
    const nodes = new DataSet<Node>();
    const edges = new DataSet<Edge>();
    // -------------------------

    let nodeId = 1;
    const nodeMap = new Map<string, number>();

    // Helper function để thêm node
    const addNode = (label: string, group: string): number => {
      if (!nodeMap.has(label)) {
        nodeMap.set(label, nodeId);
        nodes.add({
          id: nodeId,
          label,
          group,
          title: label,
        });
        nodeId++;
      }
      return nodeMap.get(label)!; // Dùng '!' vì chúng ta chắc chắn nó tồn tại
    };

    // Thêm Independent Variables (X)
    researchModel.independentVars.forEach((variable) => {
      addNode(variable.construct, "independent");
    });

    // Thêm Dependent Variables (Y)
    researchModel.dependentVars.forEach((variable) => {
      addNode(variable.construct, "dependent");
    });

    // Thêm Mediator Variables (M)
    researchModel.mediatorVars.forEach((variable) => {
      addNode(variable.construct, "mediator");
    });

    // Thêm Moderator Variables (W)
    researchModel.moderatorVars.forEach((variable) => {
      addNode(variable.construct, "moderator");
    });

    // Thêm Control Variables
    researchModel.controlVars.forEach((variable) => {
      addNode(variable.construct, "control");
    });

    // Tạo edges - Direct effects (X → Y)
    researchModel.independentVars.forEach((xVar) => {
      researchModel.dependentVars.forEach((yVar) => {
        const fromId = nodeMap.get(xVar.construct);
        const toId = nodeMap.get(yVar.construct);
        if (fromId && toId) {
          edges.add({
            id: `direct-${fromId}-${toId}`,
            from: fromId,
            to: toId,
            arrows: "to",
            color: { color: "#3b82f6" },
            label: "direct",
          });
        }
      });
    });

    // Tạo edges - Mediation paths (X → M → Y)
    researchModel.mediatorVars.forEach((mVar) => {
      const mediatorId = nodeMap.get(mVar.construct);

      // X → M
      researchModel.independentVars.forEach((xVar) => {
        const fromId = nodeMap.get(xVar.construct);
        if (fromId && mediatorId) {
          edges.add({
            id: `med-x-${fromId}-${mediatorId}`,
            from: fromId,
            to: mediatorId,
            arrows: "to",
            color: { color: "#10b981" },
            dashes: true,
          });
        }
      });

      // M → Y
      researchModel.dependentVars.forEach((yVar) => {
        const toId = nodeMap.get(yVar.construct);
        if (mediatorId && toId) {
          edges.add({
            id: `med-y-${mediatorId}-${toId}`,
            from: mediatorId,
            to: toId,
            arrows: "to",
            color: { color: "#10b981" },
            dashes: true,
          });
        }
      });
    });

    // Tạo edges - Moderator effects (W → relationships)
    researchModel.moderatorVars.forEach((wVar) => {
      const moderatorId = nodeMap.get(wVar.construct);

      // Moderator tác động lên direct effects (X -> Y)
      researchModel.independentVars.forEach((xVar) => {
        researchModel.dependentVars.forEach((yVar) => {
          const xId = nodeMap.get(xVar.construct);
          const yId = nodeMap.get(yVar.construct);
          const directEdgeId = `direct-${xId}-${yId}`;
          const directEdge = edges.get(directEdgeId);

          if (moderatorId && xId && yId && directEdge) {
            edges.add({
              id: `mod-${moderatorId}-${xId}-${yId}`,
              from: moderatorId,
              to: directEdge.id, // Liên kết đến edge chứ không phải node
              arrows: "to",
              color: { color: "#f59e0b" },
              width: 2,
              dashes: [5, 5],
            });
          }
        });
      });
    });

    // Tạo edges - Control variables (C → Y)
    researchModel.controlVars.forEach((cVar) => {
      const controlId = nodeMap.get(cVar.construct);
      researchModel.dependentVars.forEach((yVar) => {
        const yId = nodeMap.get(yVar.construct);
        if (controlId && yId) {
          edges.add({
            id: `control-${controlId}-${yId}`,
            from: controlId,
            to: yId,
            arrows: "to",
            color: { color: "#6b7280" },
            dashes: [10, 5],
          });
        }
      });
    });

    // Cấu hình network
    const options: Options = {
      nodes: {
        shape: "box",
        margin: 10,
        widthConstraint: { minimum: 100, maximum: 150 },
        font: { size: 14, face: "Arial" },
        borderWidth: 2,
        shadow: true,
      },
      edges: {
        width: 2,
        shadow: true,
        font: { size: 12, face: "Arial", align: "middle" },
        smooth: { enabled: true, type: "dynamic" },
      },
      groups: {
        independent: {
          color: { background: "#dbeafe", border: "#3b82f6" },
        },
        dependent: {
          color: { background: "#fce7f3", border: "#ec4899" },
        },
        mediator: {
          color: { background: "#f0fdf4", border: "#10b981" },
        },
        moderator: {
          color: { background: "#fef3c7", border: "#f59e0b" },
        },
        control: {
          color: { background: "#f3f4f6", border: "#6b7280" },
        },
      },
      physics: {
        enabled: true,
        barnesHut: {
          gravitationalConstant: -20000,
          centralGravity: 0.3,
          springLength: 150,
          springConstant: 0.05,
          damping: 0.09,
        },
        solver: "barnesHut",
        stabilization: { iterations: 200 },
      },
      interaction: {
        hover: true,
        tooltipDelay: 200,
      },
      layout: {
        hierarchical: false,
      },
    };

    // Tạo network instance
    networkInstance.current = new Network(
      networkRef.current,
      { nodes, edges },
      options
    );

    // Cleanup
    return () => {
      if (networkInstance.current) {
        networkInstance.current.destroy();
        networkInstance.current = null;
      }
    };
  }, [researchModel]);

  const hasContent =
    researchModel.independentVars.length > 0 ||
    researchModel.dependentVars.length > 0;

  if (!hasContent) {
    return (
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          padding: "60px 20px",
          textAlign: "center",
          border: "2px dashed #e5e7eb",
          margin: "20px 0",
        }}
      >
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>📊</div>
        <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#374151" }}>
          Research Model Network
        </h3>
        <p style={{ fontSize: "14px", color: "#6b7280" }}>
          Select constructs to visualize your research model relationships
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "white",
        borderRadius: "12px",
        padding: "20px",
        border: "1px solid #e1e5e9",
        margin: "20px 0",
        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      }}
    >
      <div ref={networkRef} style={{ height: "500px" }} />
      {/* Legend */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginTop: "15px",
          flexWrap: "wrap",
        }}
      >
        {[
          { type: "independent", label: "Independent (X)" },
          { type: "dependent", label: "Dependent (Y)" },
          { type: "mediator", label: "Mediator (M)" },
          { type: "moderator", label: "Moderator (W)" },
          { type: "control", label: "Control" },
        ].map((item) => (
          <div key={item.type} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "2px",
                border: "2px solid",
                ...(item.type === "independent" && { background: "#dbeafe", borderColor: "#3b82f6" }),
                ...(item.type === "dependent" && { background: "#fce7f3", borderColor: "#ec4899" }),
                ...(item.type === "mediator" && { background: "#f0fdf4", borderColor: "#10b981" }),
                ...(item.type === "moderator" && { background: "#fef3c7", borderColor: "#f59e0b" }),
                ...(item.type === "control" && { background: "#f3f4f6", borderColor: "#6b7280" }),
              }}
            />
            <span style={{ fontSize: "12px", color: "#6b7280" }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResearchNetworkGraph;