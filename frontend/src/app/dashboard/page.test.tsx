import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import DashboardPage from "./page";

const pushMock = vi.fn();
const logoutMock = vi.fn().mockResolvedValue(undefined);

let mockRole: "admin" | "manager" | "employee" = "admin";

// Mock router and auth context so this test focuses only on dashboard role-based rendering.
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock("@/contexts/auth-context", () => ({
  useAuth: () => ({
    user: { id: 1, name: "User", email: "user@test.com", role: mockRole },
    loading: false,
    logout: logoutMock,
  }),
}));

// Admin and manager should see "Recent Rollouts and Audit Activity", but only admin should see "+ Create" and "+ Add Rule" button.
describe("DashboardPage role-based UI", () => {
  beforeEach(() => {
    pushMock.mockClear();
    logoutMock.mockClear();
  });

  it("shows admin-only '+' control for admin", () => {
    mockRole = "admin";
    render(<DashboardPage />);
    expect(screen.getByText("+ Create")).toBeInTheDocument();
    expect(screen.getByText("Recent Rollouts")).toBeInTheDocument();
  });

  it("hides admin-only '+' control for manager but keeps manager section", () => {
    mockRole = "manager";
    render(<DashboardPage />);
    expect(screen.queryByText("+ Create")).not.toBeInTheDocument();
    expect(screen.getByText("Recent Rollouts")).toBeInTheDocument();
  });

  it("shows rollout create button for admin", () => {
    mockRole = "admin";
    render(<DashboardPage />);
    expect(screen.getByText("+ Add Rule")).toBeInTheDocument();
  });

  it("does not show rollout create button for manager", () => {
    mockRole = "manager";
    render(<DashboardPage />);
    expect(screen.queryByText("+ Add Rule")).not.toBeInTheDocument();
  });

  it("shows audit activity for admin", () => {
    mockRole = "admin";
    render(<DashboardPage />);
    expect(screen.getByText("Audit Activity")).toBeInTheDocument();
  });

  it("shows audit activity for manager", () => {
    mockRole = "manager";
    render(<DashboardPage />);
    expect(screen.getByText("Audit Activity")).toBeInTheDocument();
  });
});
