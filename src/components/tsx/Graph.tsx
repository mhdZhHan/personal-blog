import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

// Previous type definitions remain the same...
type NodeData = {
  id: string;
  text: string;
  tags: string[];
} & d3.SimulationNodeDatum;

type LinkData = {
  source: NodeData;
  target: NodeData;
} & d3.SimulationLinkDatum<NodeData>;

type GraphViewProps = {
  data: {
    nodes: { id: string; text: string; tags: string[] }[];
    links: { source: string; target: string }[];
  };
  options?: {
    drag?: boolean;
    zoom?: boolean;
    depth?: number;
    scale?: number;
    repelForce?: number;
    centerForce?: number;
    linkDistance?: number;
    fontSize?: number;
    opacityScale?: number;
    showTags?: boolean;
    removeTags?: string[];
    focusOnHover?: boolean;
  };
};

const defaultOptions = {
  drag: true,
  zoom: true,
  depth: 1,
  scale: 0.5,
  repelForce: 0.5,
  centerForce: 0.3,
  linkDistance: 30,
  fontSize: 0.6,
  opacityScale: 1,
  showTags: true,
  removeTags: [],
  focusOnHover: false,
};

export default function GraphView({ data, options = {} }: GraphViewProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [isGlobalView, setIsGlobalView] = useState(false);
  const mergedOptions = { ...defaultOptions, ...options };

  useEffect(() => {
    if (!svgRef.current || !data) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Clear existing SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    // Process data
    const nodes: NodeData[] = data.nodes.map((node) => ({
      ...node,
      x: Math.random() * width,
      y: Math.random() * height,
    }));

    const links: LinkData[] = data.links.map((link) => ({
      source: nodes.find((n) => n.id === link.source)!,
      target: nodes.find((n) => n.id === link.target)!,
    }));

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .attr("class", "overflow-hidden");

    // Create container for zoom
    const container = svg.append("g");

    // Create tooltip div
    const tooltip = d3
      .select(svgRef.current.parentElement)
      .append("div")
      .attr(
        "class",
        "absolute pointer-events-none bg-white px-2 py-1 rounded shadow-md text-sm opacity-0 transition-opacity duration-200",
      )
      .style("z-index", 1000);

    // Create links
    const link = container
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("class", "stroke-gray-300")
      .attr("stroke-width", 1);

    // Create node groups
    const nodeGroup = container
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("class", "cursor-pointer");

    // Add circles to node groups
    const node = nodeGroup
      .append("circle")
      .attr("r", 5)
      .attr("class", "fill-blue-500")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5);

    // Add labels to node groups
    const labels = nodeGroup
      .append("text")
      .text((d) => d.text)
      .attr("class", "text-xs fill-gray-700 pointer-events-none select-none")
      .attr("dy", -8)
      .style("text-anchor", "middle")
      .style("opacity", 0);

    // Handle node hover effects
    nodeGroup
      .on("mouseover", function (event, d) {
        const transform = d3.zoomTransform(svg.node()!);
        const [x, y] = d3.pointer(event, svgRef.current);

        // Show tooltip

        // tooltip
        //   .html(`${d.text}`)
        //   .style("left", `${x + 10}px`)
        //   .style("top", `${y - 10}px`)
        //   .style("opacity", 1);

        // Highlight connected nodes
        const connectedNodes = links.reduce((acc: NodeData[], link) => {
          if (link.source === d) acc.push(link.target as NodeData);
          if (link.target === d) acc.push(link.source as NodeData);
          return acc;
        }, []);

        nodeGroup.style("opacity", (n) =>
          n === d || connectedNodes.includes(n as NodeData) ? 1 : 0.3,
        );

        link
          .style("opacity", (l) => (l.source === d || l.target === d ? 1 : 0.3))
          .style("stroke-width", (l) =>
            l.source === d || l.target === d ? 2 : 1,
          );

        // Make current node's label fully visible
        d3.select(this)
          .select("text")
          .style("opacity", 1)
          .style("font-weight", "bold");
      })
      .on("mouseout", function () {
        // Hide tooltip
        tooltip.style("opacity", 0);

        // Reset opacity and stroke width
        nodeGroup.style("opacity", 1);
        link.style("opacity", 1).style("stroke-width", 1);

        // Reset label opacity based on zoom level
        const transform = d3.zoomTransform(svg.node()!);
        const labelOpacity = calculateLabelOpacity(transform.k);
        labels.style("opacity", labelOpacity);
        d3.select(this).select("text").style("font-weight", "normal");
      })
      .on("mousemove", function (event, d) {
        const [x, y] = d3.pointer(event, svgRef.current);
        tooltip.style("left", `${x + 10}px`).style("top", `${y - 10}px`);
      });

    // Function to calculate label opacity based on zoom level
    const calculateLabelOpacity = (scale: number) => {
      return Math.min(Math.max((scale - 0.8) / 0.7, 0), 0.7);
    };

    // Force simulation
    const simulation = d3
      .forceSimulation(nodes)
      .force("link", d3.forceLink(links).distance(mergedOptions.linkDistance))
      .force(
        "charge",
        d3.forceManyBody().strength(-mergedOptions.repelForce * 100),
      )
      .force(
        "center",
        d3
          .forceCenter(width / 2, height / 2)
          .strength(mergedOptions.centerForce),
      )
      .force("collision", d3.forceCollide().radius(15));

    // Add zoom behavior
    if (mergedOptions.zoom) {
      const zoom = d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.2, 4])
        .on("zoom", (event) => {
          container.attr("transform", event.transform);

          // Update label opacity based on zoom level
          const labelOpacity = calculateLabelOpacity(event.transform.k);
          labels.style("opacity", labelOpacity);
        });

      svg.call(zoom);
      svg.call(zoom.transform, d3.zoomIdentity.scale(mergedOptions.scale));
    }

    // Add drag behavior
    if (mergedOptions.drag) {
      const drag = d3
        .drag<SVGGElement, NodeData>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;

          // Update tooltip position during drag
          const [x, y] = d3.pointer(event, svgRef.current);
          if (tooltip.style("opacity") === "1") {
            tooltip.style("left", `${x + 10}px`).style("top", `${y - 10}px`);
          }
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        });

      nodeGroup.call(drag);
    }

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as NodeData).x!)
        .attr("y1", (d) => (d.source as NodeData).y!)
        .attr("x2", (d) => (d.target as NodeData).x!)
        .attr("y2", (d) => (d.target as NodeData).y!);

      nodeGroup.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    // Cleanup
    return () => {
      simulation.stop();
      tooltip.remove();
    };
  }, [data, mergedOptions]);

  return (
    <div className="relative w-full">
      <div className="border border-gray-200 rounded-lg h-64 relative overflow-hidden w-1/2 mx-auto">
        <svg ref={svgRef} className="w-full h-full" />
        <button
          onClick={() => setIsGlobalView(true)}
          className="absolute top-2 right-2 p-1 rounded hover:bg-gray-100 transition-colors"
        >
          <svg
            className="w-6 h-6 text-gray-600"
            viewBox="0 0 55 55"
            fill="currentColor"
          >
            <path d="M49,0c-3.309,0-6,2.691-6,6c0,1.035,0.263,2.009,0.726,2.86l-9.829,9.829C32.542,17.634,30.846,17,29,17s-3.542,0.634-4.898,1.688l-7.669-7.669C16.785,10.424,17,9.74,17,9c0-2.206-1.794-4-4-4S9,6.794,9,9s1.794,4,4,4c0.74,0,1.424-0.215,2.019-0.567l7.669,7.669C21.634,21.458,21,23.154,21,25s0.634,3.542,1.688,4.897L10.024,42.562C8.958,41.595,7.549,41,6,41c-3.309,0-6,2.691-6,6s2.691,6,6,6s6-2.691,6-6c0-1.035-0.263-2.009-0.726-2.86l12.829-12.829c1.106,0.86,2.44,1.436,3.898,1.619v10.16c-2.833,0.478-5,2.942-5,5.91c0,3.309,2.691,6,6,6s6-2.691,6-6c0-2.967-2.167-5.431-5-5.91v-10.16c1.458-0.183,2.792-0.759,3.898-1.619l7.669,7.669C41.215,39.576,41,40.26,41,41c0,2.206,1.794,4,4,4s4-1.794,4-4s-1.794-4-4-4c-0.74,0-1.424,0.215-2.019,0.567l-7.669-7.669C36.366,28.542,37,26.846,37,25s-0.634-3.542-1.688-4.897l9.665-9.665C46.042,11.405,47.451,12,49,12c3.309,0,6-2.691,6-6S52.309,0,49,0z" />
          </svg>
        </button>
      </div>

      {isGlobalView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div
            ref={modalRef}
            className="w-4/5 h-4/5 bg-white rounded-lg border border-gray-200 relative"
          >
            <svg className="w-full h-full" ref={svgRef} />
          </div>
        </div>
      )}
    </div>
  );
}
