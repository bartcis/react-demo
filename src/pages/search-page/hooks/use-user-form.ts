import { useForm } from "react-hook-form";
import { useCallback, useEffect } from "react";
import { useDebounce } from "../../../hooks/use-debounce";
import { yupResolver } from "@hookform/resolvers/yup";
import { formValidator } from "../../../utils/form";

export interface UseUserFormProps {
  onSubmit: (userName: string) => void;
  onInputChange: () => void;
}

export const useUserForm = ({ onSubmit, onInputChange }: UseUserFormProps) => {
  const { control, watch, handleSubmit, trigger } = useForm({
    defaultValues: {
      userName: "",
    },
    resolver: yupResolver(formValidator),
  });

  // useDebounce tez bazuje na Curryingu
  const debouncedSubmit = useDebounce(2000);

  const submitForm = useCallback(async () => {
    // Trigger validations before submitting
    const isValid = await trigger();

    if (isValid) {
      // handleSubmit jest funkcją wykorzystującą koncepcje programowania funcyjnego - Currying czyli zagniezdzona egzekucje
      handleSubmit((data) => onSubmit(data.userName))();
    }
  }, [onSubmit, handleSubmit]);

  useEffect(() => {
    const { unsubscribe } = watch(() => {
      onInputChange();
      debouncedSubmit(submitForm);
    });
    return () => unsubscribe();
  }, [watch]);

  return control;
};
