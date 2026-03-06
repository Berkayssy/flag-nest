import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "./page";

const pushMock = vi.fn(); // Fake push function
const loginMock = vi.fn().mockResolvedValue(undefined); // Fake login function

// We mock router and auth dependencies to isolate component behavior; this test verifies UI flow only.
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock("@/contexts/auth-context", () => ({
  useAuth: () => ({ login: loginMock }),
}));

describe("Login page", () => {
  // Before each test, we clear the mock function calls to ensure tests are independent and do not interfere with each other.
  beforeEach(() => {
    pushMock.mockClear();
    loginMock.mockClear();
  });

  // After submitting the form, we expect the login function to be called with the correct credentials and then a redirect to the dashboard.
  it("submits credentials and redirects to dashboard", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.clear(emailInput);
    await user.type(emailInput, "berkay@test.com");
    await user.clear(passwordInput);
    await user.type(passwordInput, "123456");

    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(loginMock).toHaveBeenCalledWith({ email: "berkay@test.com", password: "123456" });
    expect(pushMock).toHaveBeenCalledWith("/dashboard");
  });
});
