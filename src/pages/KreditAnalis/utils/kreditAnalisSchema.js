import * as Yup from "yup";

export const kreditAnalisSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email().required("Email is required"),
  address: Yup.string().required("Alamat is required"),
  phoneNumber: Yup.string()
    .matches(/^[0-9]+$/, "Phone number must only contain numbers")
    .required("No Telp is required")
    .min(11, "No Telp min 11 number"),
  enabled: Yup.string().oneOf(["true", "false"]).required("Status is required"),
});
