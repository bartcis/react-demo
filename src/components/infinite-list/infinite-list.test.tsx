import React, { ReactNode } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import InfiniteList from "./infinite-list";

const mockUseInView = jest.fn();

jest.mock("react-intersection-observer", () => ({
  useInView: () => mockUseInView(),
}));

jest.mock(
  "@mui/material/List",
  () =>
    ({ children }: { children: ReactNode }) =>
      <div data-testid="List">{children}</div>
);

const renderer = ({
  hasData = true,
  isLoading = false,
  isError = false,
  hasNextPage = true,
  isFetchingNextPage = false,
  loadMore = jest.fn(),
}) =>
  render(
    <InfiniteList
      hasData={hasData}
      isLoading={isLoading}
      isError={isError}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      loadMore={loadMore}
    >
      List content
    </InfiniteList>
  );

beforeEach(() =>
  mockUseInView.mockReturnValue({
    ref: jest.fn(),
    inView: true,
  })
);

test("renders expected components", () => {
  renderer({});

  expect(screen.getByTestId("List")).toBeVisible();
  expect(screen.getByText("List content")).toBeVisible();
});

test("triggers loadMore function when status element is inView", async () => {
  const mockLoadMore = jest.fn();

  renderer({ loadMore: mockLoadMore });

  await waitFor(() => expect(mockLoadMore).toHaveBeenCalledTimes(1));
});

const cases = [
  { isLoading: true, result: "Loading..." },
  { hasData: false, result: "No results" },
  { isError: true, result: "There was an error, try again later" },
  { isFetchingNextPage: true, result: "Loading more..." },
  { hasNextPage: false, result: "No more results" },
];

describe("renders expected statuses", () => {
  test.each(cases)(
    "given arguments, returns status",
    ({
      isLoading,
      hasData,
      hasNextPage,
      isError,
      isFetchingNextPage,
      result,
    }) => {
      renderer({
        isLoading,
        hasData,
        hasNextPage,
        isError,
        isFetchingNextPage,
      });

      expect(screen.getByText(result)).toBeVisible();
    }
  );
});
