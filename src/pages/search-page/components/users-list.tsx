import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { User } from "../../../utils/models";

import { InfiniteList } from "../../../components/infinite-list/infinite-list";

interface Props {
  users: User[];
  isLoading: boolean;
  isError: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  loadMore: () => void;
}

export const UsersList = ({ users, ...rest }: Props) => {
  return (
    <InfiniteList hasData={!!users.length} {...rest}>
      {users.map(({ avatarUrl, login, id }) => (
        <ListItem key={id}>
          <ListItemAvatar>
            <Avatar src={avatarUrl} />
          </ListItemAvatar>
          <ListItemText primary={login} />
        </ListItem>
      ))}
    </InfiniteList>
  );
};
