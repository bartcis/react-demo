import List from "@mui/material/List";
import { useInView } from "react-intersection-observer";
import { ReactNode, useEffect, useMemo } from "react";

import styles from "./infinite-list.module.css";

interface Props {
  hasData: boolean;
  isLoading: boolean;
  isError: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  loadMore: () => void;
  children: ReactNode;
}

export const InfiniteList = ({
  hasData,
  isLoading,
  isError,
  hasNextPage,
  isFetchingNextPage,
  loadMore,
  children,
}: Props) => {
  const { ref, inView } = useInView();

  const hasResults = hasData && !isError;

  const statusText = useMemo(() => {
    if (isLoading && !isFetchingNextPage) {
      return "Loading...";
    }

    if (!hasResults && !isError) {
      return "No results";
    }

    if (isError) {
      return "There was an error, try again later";
    }
  }, [isLoading, hasResults, isError, isFetchingNextPage]);

  const listState = useMemo(() => {
    if (isFetchingNextPage) {
      return "Loading more...";
    }

    if (hasResults && !hasNextPage) {
      return "No more results";
    }
  }, [hasNextPage, hasResults, isFetchingNextPage]);

  useEffect(() => {
    if (hasNextPage && inView) {
      loadMore();
    }
  }, [inView]);

  return (
    <List className={styles.List}>
      {statusText && <p className={styles.Indicator}>{statusText}</p>}
      {!statusText && (
        <>
          {children}
          <p ref={ref} className={styles.Indicator}>
            {listState}
          </p>
        </>
      )}
    </List>
  );
};

export default InfiniteList;
