import { render, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { AgentDot } from "@/components/office-2d/AgentDot";
import type { VisualAgent } from "@/gateway/types";
import { STATUS_COLORS } from "@/lib/constants";
import { useOfficeStore } from "@/store/office-store";

const mockAgent: VisualAgent = {
  id: "a1",
  name: "TestBot",
  status: "idle",
  position: { x: 200, y: 150 },
  currentTool: null,
  speechBubble: null,
  lastActiveAt: Date.now(),
  toolCallCount: 0,
  toolCallHistory: [],
  runId: null,
  isSubAgent: false,
  parentAgentId: null,
  childAgentIds: [],
  zone: "desk",
  originalPosition: null,
};

function renderDot(agent: VisualAgent = mockAgent) {
  return render(
    <svg>
      <AgentDot agent={agent} />
    </svg>,
  );
}

describe("AgentDot", () => {
  beforeEach(() => {
    useOfficeStore.setState({ selectedAgentId: null });
  });

  it("renders circle with status color as stroke", () => {
    const { container } = renderDot();
    const circle = container.querySelector("circle");
    expect(circle?.getAttribute("stroke")).toBe(STATUS_COLORS.idle);
  });

  it("renders circle with error color stroke", () => {
    const { container } = renderDot({ ...mockAgent, status: "error" });
    const circles = container.querySelectorAll("circle");
    const mainCircle = circles[0];
    expect(mainCircle.getAttribute("stroke")).toBe(STATUS_COLORS.error);
  });

  it("renders a foreignObject for the icon", () => {
    const { container } = renderDot();
    const fo = container.querySelector("foreignObject");
    expect(fo).toBeTruthy();
  });

  it("clicking triggers selectAgent", () => {
    const { container } = renderDot();
    const g = container.querySelector("g");
    fireEvent.click(g!);
    expect(useOfficeStore.getState().selectedAgentId).toBe("a1");
  });
});
