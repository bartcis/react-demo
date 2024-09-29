import { Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import { useUserForm, UseUserFormProps } from "../hooks/use-user-form";

type Props = UseUserFormProps;

export const UserForm = ({ onSubmit, onInputChange }: Props) => {
  const control = useUserForm({ onSubmit, onInputChange });

  return (
    <form>
      <Controller
        name="userName"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Github User"
            variant="outlined"
            fullWidth
          />
        )}
      />
    </form>
  );
};
