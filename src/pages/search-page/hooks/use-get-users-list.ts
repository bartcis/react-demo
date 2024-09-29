import { useCallback, useMemo, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { UsersQueryKeys } from "../../../utils/query-keys";
// @ts-ignore
import * as changeKeys from "change-case/keys";
import { Page } from "../../../utils/models";

const API_PAGE_LIMIT = 30;

export const useGetUsersList = () => {
  const [searchPhrase, setSearchPhrase] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const {
    data,
    error,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: [UsersQueryKeys.UsersInfiniteList, searchPhrase],
    queryFn: async ({ pageParam }): Promise<Page> => {
      const response = await fetch(
        `https://api.github.com/search/users?q=${searchPhrase}&page=${pageParam}&per_page=${API_PAGE_LIMIT}`
      );
      const result = await response.json();
      const camelCasedResult = changeKeys.camelCase(result, 3);
      setIsTyping(false);

      if (camelCasedResult.message) {
        throw new Error();
      }

      return camelCasedResult;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, d, g) => {
      return lastPage.items?.length === API_PAGE_LIMIT && !isTyping
        ? allPages.length + 1
        : undefined;
    },
    enabled: !!searchPhrase.length,
    retry: false,
    staleTime: 120000,
  });

  const handleSubmit = useCallback(
    (userName: string) => setSearchPhrase(userName),
    [setSearchPhrase]
  );

  // Memoizacja tez jest uzyciem programowania funkcyjnego Currying - https://dev.to/uttarasriya/js-polyfills-part-6-curry-memoise-and-generator-functions-1d71
  const handleInputChange = useCallback(
    () => setIsTyping(true),
    [setSearchPhrase]
  );

  // Ta transformacja danych jest uzyciem programowania funkcyjnego bo kazdy [] jest funktorem
  const usersList = useMemo(
    () => (data ? data?.pages.flatMap((page) => page.items) : []),
    [data]
  );

  return {
    handleSubmit,
    handleInputChange,
    users: usersList,
    isLoading: isTyping || isFetching,
    isError: !!error,
    loadMore: fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};
