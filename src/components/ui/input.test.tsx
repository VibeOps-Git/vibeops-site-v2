import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test/test-utils";
import userEvent from "@testing-library/user-event";
import { Input } from "./input";

describe("Input", () => {
  it("renders correctly", () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  it("accepts user input", async () => {
    const user = userEvent.setup();
    render(<Input placeholder="Type here" />);

    const input = screen.getByPlaceholderText("Type here");
    await user.type(input, "Hello World");

    expect(input).toHaveValue("Hello World");
  });

  it("handles onChange events", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(<Input onChange={handleChange} />);
    await user.type(screen.getByRole("textbox"), "test");

    expect(handleChange).toHaveBeenCalled();
  });

  it("can be disabled", () => {
    render(<Input disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("supports different types", () => {
    const { rerender, container } = render(<Input type="email" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("type", "email");

    rerender(<Input type="password" />);
    const passwordInput = container.querySelector('input[type="password"]');
    expect(passwordInput).toBeInTheDocument();
  });

  it("accepts custom className", () => {
    render(<Input className="custom-input" />);
    expect(screen.getByRole("textbox")).toHaveClass("custom-input");
  });

  it("forwards ref correctly", () => {
    const ref = vi.fn();
    render(<Input ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});
