import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { UserForm } from "./user-form";
import userEvent from "@testing-library/user-event";

const mockOnSubmit = jest.fn();
const mockOnInputChange = jest.fn();

// In fact this is integration test as useUserForm are checked with user interaction. Pure unit test would mock the hook

const renderer = () =>
  render(
    <UserForm onSubmit={mockOnSubmit} onInputChange={mockOnInputChange} />
  );

test("renders input and triggers expected functions on user interaction", async () => {
  const user = userEvent.setup();

  renderer();

  const input = screen.getByRole("textbox", { name: "Github User" });

  expect(input).toBeVisible();

  const typedUser = "John";
  await user.type(input, typedUser);
  expect(mockOnInputChange).toHaveBeenCalledTimes(typedUser.length);

  await waitFor(() => expect(mockOnSubmit).toHaveBeenCalledWith(typedUser), {
    timeout: 3000,
  });
});
