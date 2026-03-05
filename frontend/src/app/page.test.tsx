import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home page", () => {
  // This test checks if the Home page renders the brand name and the main call-to-action links for signing in and getting started.
  it("renders brand and main call to action", () => {
    render(<Home />);

    expect(screen.getByText("Flag Nest")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /get started/i })).toBeInTheDocument();
  });
});
