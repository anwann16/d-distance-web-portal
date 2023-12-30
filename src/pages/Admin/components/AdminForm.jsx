import { useFormik } from "formik";
import { useParams, useNavigate } from "react-router-dom";

import ButtonLogout from "../../../components/ButtonLogout";
import HeaderListUser from "../../../components/HeaderListUser";
import Input from "../../../components/Input";
import InputError from "../../../components/InputError";

import { useFetchAdmin } from "../../../hooks/admin/useFetchAdmin";
import { useAddAdmin } from "../../../hooks/admin/useAddAdmin";
import { adminSchema } from "../utils/adminSchema";
import { useToogle } from "../../../context/ToogleContext";
import { useEditAdmin } from "../../../hooks/admin/useEditAdmin";
import { useEffect } from "react";
import { useFetchAdminById } from "../../../hooks/admin/useFetchAdminById";
import { valueAddAdmin, valueEditAdmin } from "../utils/value";

const AdminForm = () => {
  const { logout } = useToogle();
  const navigate = useNavigate();
  const { id } = useParams();

  const initialValues = id ? valueEditAdmin : valueAddAdmin;

  const {
    values: { name, email, address, phoneNumber, enabled, role },
    errors,
    dirty,
    isValid,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setValues,
  } = useFormik({
    initialValues,
    onSubmit: (values) => {
      if (id) {
        editAdmin(values);
      } else {
        addAdmin(values);
      }
    },

    validationSchema: adminSchema,
  });

  const { refetch: refetchAdmin, data: admins } = useFetchAdmin();

  const { mutate: addAdmin } = useAddAdmin({
    onSuccess: () => {
      navigate("/dashboard/admin");
      refetchAdmin();
    },
  });

  const { mutate: editAdmin } = useEditAdmin({
    onSuccess: () => {
      navigate("/dashboard/admin");
      refetchAdmin();
    },
  });

  const { data: getAdminById } = id ? useFetchAdminById(id) : {};

  useEffect(() => {
    if (id && admins) {
      const adminToEdit = admins.find((admin) => admin.id === id);

      if (adminToEdit) {
        setFieldValue("name", adminToEdit.name);
        setFieldValue("email", adminToEdit.email);
        setFieldValue("address", adminToEdit.address);
        setFieldValue("phoneNumber", adminToEdit.phoneNumber);
        setFieldValue("enabled", adminToEdit.enabled);
        setFieldValue("role", adminToEdit.role);
      }

      const result = getAdminById;
      const updatedAdmin = { ...result };

      const values = {
        id: updatedAdmin.id,
        name: updatedAdmin.name,
        email: updatedAdmin.email,
        address: updatedAdmin.address,
        phoneNumber: updatedAdmin.phoneNumber,
        enabled: updatedAdmin.enabled,
        role: updatedAdmin.role,
      };

      setValues(values);
    }
  }, [id, admins, handleChange, getAdminById, setValues, setFieldValue]);

  return (
    <>
      <HeaderListUser />

      <div className="bg-background mx-10 h-[88vh]">
        <div className="flex justify-end absolute right-10">
          {logout && <ButtonLogout />}
        </div>

        <h1 className="text-primary text-3xl font-extrabold mx-10 py-5">
          {id ? "Edit Admin" : "Tambah Admin"}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="bg-bgSecondary ml-8 py-3 w-[60%] min-h-full rounded-2xl pb-10">
            <div className="flex flex-col gap-2 w-[50%] mx-5">
              <label htmlFor="name" className="text-primary font-semibold">
                Nama
              </label>
              <div>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  styleError={
                    touched.name && errors.name ? "outline-red-500" : ""
                  }
                />
                <InputError>{touched.name && errors.name}</InputError>
              </div>

              <label htmlFor="email" className="text-primary font-semibold">
                Email
              </label>
              <div>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  styleError={
                    touched.email && errors.email ? "outline-red-500" : ""
                  }
                />
                <InputError>{touched.email && errors.email}</InputError>
              </div>

              <label htmlFor="address" className="text-primary font-semibold">
                Alamat
              </label>
              <div>
                <Input
                  type="text"
                  name="address"
                  id="address"
                  value={address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  styleError={
                    touched.address && errors.address ? "outline-red-500" : ""
                  }
                />
                <InputError>{touched.address && errors.address}</InputError>
              </div>

              <label
                htmlFor="phoneNumber"
                className="text-primary font-semibold"
              >
                No. Telp
              </label>
              <div>
                <Input
                  type="text"
                  name="phoneNumber"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  styleError={
                    touched.phoneNumber && errors.phoneNumber
                      ? "outline-red-500"
                      : ""
                  }
                />
                <InputError>
                  {touched.phoneNumber && errors.phoneNumber}
                </InputError>
              </div>

              {id && (
                <>
                  <label htmlFor="role" className="text-primary font-semibold">
                    Tipe User
                  </label>
                  <select
                    name="role"
                    id="role"
                    onChange={handleChange}
                    value={role}
                    className="border-none outline-none px-2 py-[7px] rounded-2xl w-[78%] bg-white"
                  >
                    <option value="ROLE_ADMIN">1</option>
                    <option value="ROLE_CREDIT_ANALYST">2</option>
                  </select>
                </>
              )}

              <label htmlFor="enabled" className="text-primary font-semibold">
                Status User
              </label>
              <select
                name="enabled"
                id="enabled"
                onChange={handleChange}
                value={enabled}
                className="border-none outline-none px-2 py-[7px] rounded-2xl w-[78%] bg-white"
              >
                <option value="Select Status" disabled>
                  Select Status
                </option>
                <option value={true} className="p-5">
                  Aktif
                </option>
                <option value={false}>Non Aktif</option>
              </select>
            </div>
          </div>
          <div className={`flex justify-end mr-16 py-14`}>
            <button
              className="bg-[#F36C21] text-white text-sm font-bold py-1 px-7 rounded-md"
              type="submit"
              disabled={!dirty || !isValid}
            >
              {id ? "Simpan" : "Tambah"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AdminForm;
