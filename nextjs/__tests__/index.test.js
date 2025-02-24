import { render, screen } from "@testing-library/react";
import Home from "../pages/index";

test("renders homepage with text", () => {
  render(<Home />);
  const heading = screen.getByText("Hello, Next.js!");
  expect(heading).toBeInTheDocument();
});
