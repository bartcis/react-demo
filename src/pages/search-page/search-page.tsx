import { UserForm } from "./components/user-form";
import { useGetUsersList } from "./hooks/use-get-users-list";
import { UsersList } from "./components/users-list";

export const SearchPage = () => {
  const { handleSubmit, handleInputChange, ...props } = useGetUsersList();

  return (
    <>
      <h2>Type username to get results</h2>
      <UserForm onSubmit={handleSubmit} onInputChange={handleInputChange} />
      <UsersList {...props} />
    </>
  );
};
