import { renderHook, act } from "@testing-library/react-hooks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { useGetUsersList } from "./use-get-users-list";
import nock from "nock";

function generateMockedResponse(page: string) {
  return {
    page: page,
    items: [{ name: "john" }],
  };
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

test("should return expected output", () => {
  const { result } = renderHook(() => useGetUsersList(), {
    wrapper,
  });

  expect(result.current.handleInputChange).toBeInstanceOf(Function);
  expect(result.current.handleSubmit).toBeInstanceOf(Function);
  expect(result.current.users).toEqual([]);
  expect(result.current.isLoading).toEqual(false);
  expect(result.current.isError).toEqual(false);
  expect(result.current.loadMore).toBeInstanceOf(Function);
  expect(result.current.hasNextPage).toEqual(false);
  expect(result.current.isFetchingNextPage).toEqual(false);
});

// I tried to add API test but currently Create React App apps (like this one) seem to have problem with compiling Jest (or intercepting a call)
// when using HTTP requests intercepting with modern packages like eg. nock or msw.
// eg. https://github.com/mswjs/msw/issues/1796
// Fixing it more time consuming that writing the tests and is outside of the scope of this task.
// Some pseudo-test added instead. To fix it I would have to work on proper production project setup
test.skip("should send API call and update data when searchPhrase is set", async () => {
  const searchPhrase = "John";
  const expectation = nock(`https://api.github.com`)
    .persist()
    .get(`/search/users`)
    .query({ q: searchPhrase, page: 1, per_page: 30 })
    .reply(200, (uri: string) => {
      const url = new URL(`https://api.github.com${uri}`);
      const { page } = Object.fromEntries(url.searchParams);

      return generateMockedResponse(page);
    });

  const { result, waitFor } = renderHook(() => useGetUsersList(), {
    wrapper,
  });

  act(() => {
    result.current.handleSubmit(searchPhrase);
  });

  expect(result.current.isLoading).toEqual(true);

  await waitFor(() => {
    return !!result.current.users.length;
  });

  expect(result.current.isLoading).toEqual(false);
  expect(result.current.users).toEqual([{ name: "john" }]);

  expectation.done();
});
