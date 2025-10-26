// FILE: components/ResearchNetworkGraph.tsx
import React, { useEffect, useRef } from "react";
import { DataSet } from "vis-data";
import { Network } from "vis-network";

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

const ResearchNetworkGraph: React.FC<ResearchNetworkGraphProps> = ({
  researchModel,
}) => {
  const networkRef = useRef<HTMLDivElement>(null);
  const networkInstance = useRef<Network | null>(null);

  useEffect(() => {
    if (!networkRef.current) return;

    // Tạo nodes
    const nodes = new DataSet<any>();
    const edges = new DataSet<any>();

    let nodeId = 1;
    const nodeMap = new Map<string, number>();

    // Helper function để thêm node
    const addNode = (label: string, group: string) => {
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
      return nodeMap.get(label);
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
            smooth: { enabled: true, type: "continuous" },
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
            label: "to mediator",
            smooth: { enabled: true, type: "continuous" },
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
            label: "to outcome",
            smooth: { enabled: true, type: "continuous" },
            dashes: true,
          });
        }
      });
    });

    // Tạo edges - Moderator effects (W → relationships)
    researchModel.moderatorVars.forEach((wVar) => {
      const moderatorId = nodeMap.get(wVar.construct);

      // Moderator tác động lên direct effects
      researchModel.independentVars.forEach((xVar) => {
        researchModel.dependentVars.forEach((yVar) => {
          const xId = nodeMap.get(xVar.construct);
          const yId = nodeMap.get(yVar.construct);

          if (moderatorId && xId && yId) {
            // Tìm edge direct effect tương ứng
            const directEdge = edges.get(`direct-${xId}-${yId}`);
            if (directEdge) {
              edges.add({
                id: `mod-${moderatorId}-${xId}-${yId}`,
                from: moderatorId,
                to: directEdge.id, // Liên kết đến edge chứ không phải node
                arrows: "to",
                color: { color: "#f59e0b" },
                label: "moderates",
                width: 2,
                dashes: [5, 5],
              });
            }
          }
        });
      });

      // Moderator tác động lên mediation paths
      researchModel.mediatorVars.forEach((mVar) => {
        const mediatorId = nodeMap.get(mVar.construct);

        researchModel.independentVars.forEach((xVar) => {
          const xId = nodeMap.get(xVar.construct);
          if (moderatorId && xId && mediatorId) {
            const medEdge = edges.get(`med-x-${xId}-${mediatorId}`);
            if (medEdge) {
              edges.add({
                id: `mod-med-${moderatorId}-${xId}-${mediatorId}`,
                from: moderatorId,
                to: medEdge.id,
                arrows: "to",
                color: { color: "#f59e0b" },
                label: "moderates",
                width: 2,
                dashes: [5, 5],
              });
            }
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
            label: "controls",
            smooth: { enabled: true, type: "continuous" },
            dashes: [10, 5],
          });
        }
      });
    });

    // Cấu hình network
    const options = {
      nodes: {
        shape: "box",
        margin: 10,
        widthConstraint: {
          minimum: 100,
          maximum: 150,
        },
        font: {
          size: 14,
          face: "Arial",
        },
        borderWidth: 2,
        shadow: true,
      },
      edges: {
        width: 2,
        shadow: true,
        font: {
          size: 12,
          face: "Arial",
        },
        smooth: {
          enabled: true,
          type: "continuous",
        },
      },
      groups: {
        independent: {
          color: {
            background: "#dbeafe",
            border: "#3b82f6",
            highlight: {
              background: "#bfdbfe",
              border: "#1d4ed8",
            },
          },
        },
        dependent: {
          color: {
            background: "#fce7f3",
            border: "#ec4899",
            highlight: {
              background: "#fbcfe8",
              border: "#be185d",
            },
          },
        },
        mediator: {
          color: {
            background: "#f0fdf4",
            border: "#10b981",
            highlight: {
              background: "#dcfce7",
              border: "#047857",
            },
          },
        },
        moderator: {
          color: {
            background: "#fef3c7",
            border: "#f59e0b",
            highlight: {
              background: "#fef08a",
              border: "#b45309",
            },
          },
        },
        control: {
          color: {
            background: "#f3f4f6",
            border: "#6b7280",
            highlight: {
              background: "#e5e7eb",
              border: "#374151",
            },
          },
        },
      },
      physics: {
        enabled: true,
        stabilization: {
          enabled: true,
          iterations: 1000,
        },
        barnesHut: {
          gravitationalConstant: -8000,
          springConstant: 0.04,
          springLength: 95,
        },
      },
      interaction: {
        hover: true,
        tooltipDelay: 200,
        zoomView: true,
        dragView: true,
      },
      layout: {
        improvedLayout: true,
      },
      height: "500px",
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
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "600",
            marginBottom: "8px",
            color: "#374151",
          }}
        >
          Research Model Network
        </h3>
        <p
          style={{
            fontSize: "14px",
            color: "#6b7280",
            maxWidth: "400px",
            margin: "0 auto",
          }}
        >
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
      }}
    >
      <h4 style={{ marginBottom: "15px", color: "#374151" }}>
        Research Model Network
      </h4>

      <div
        ref={networkRef}
        style={{
          height: "500px",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
        }}
      />

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
          <div
            key={item.type}
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "2px",
                border: "2px solid",
                ...(item.type === "independent" && {
                  background: "#dbeafe",
                  borderColor: "#3b82f6",
                }),
                ...(item.type === "dependent" && {
                  background: "#fce7f3",
                  borderColor: "#ec4899",
                }),
                ...(item.type === "mediator" && {
                  background: "#f0fdf4",
                  borderColor: "#10b981",
                }),
                ...(item.type === "moderator" && {
                  background: "#fef3c7",
                  borderColor: "#f59e0b",
                }),
                ...(item.type === "control" && {
                  background: "#f3f4f6",
                  borderColor: "#6b7280",
                }),
              }}
            />
            <span style={{ fontSize: "12px", color: "#6b7280" }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResearchNetworkGraph;
