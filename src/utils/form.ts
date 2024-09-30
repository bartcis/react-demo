import * as yup from "yup";

export const formValidator = yup.object({
  userName: yup.string().required("To pole jest wymagane"),
});
