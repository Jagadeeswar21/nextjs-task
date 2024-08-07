"use client";

import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { registrationService } from "@/services/registrationService";

interface FormValues {
  name: string;
  email: string;
  password: string;
  role: string;
}

const RegisterForm: React.FC = () => {
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    role: Yup.string().required("Role is required"),
  });

  const formik = useFormik<FormValues>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      role: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const { user } = await registrationService.userExists(values.email);
        if (user) {
          setError("User already exists");
          return;
        }

        await registrationService.registerUser(values);
        resetForm();
        toast.success("Registration successful!", {
          position: "bottom-right",
        });
        router.push("/");
      } catch (error: any) {
        setError("Error during registration: " + error.message);
        console.log(error);
      }
    },
  });

  return (
    <div className="grid place-items-center h-screen bg-white">
      <div className="shadow-lg p-6 rounded-lg border-t-4 bg-white">
        <h1 className="text-xl font-bold text-centre text-black my-4">
          Registration Page
        </h1>
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            className={
              formik.touched.name && formik.errors.name
                ? "border-red-500"
                : "placeholder-gray text-gray border border-gray focus:outline-none focus:ring focus:border-blue-300 border-gray-300 rounded-md shadow-sm py-2 px-4 block w-full sm:text-sm"
            }
          />
          {formik.touched.name && formik.errors.name && (
            <div className="text-red-500 text-sm">{formik.errors.name}</div>
          )}
          <input
            type="text"
            name="email"
            placeholder="Email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className={
              formik.touched.email && formik.errors.email
                ? "border-red-500"
                : "placeholder-gray text-gray border border-gray focus:outline-none focus:ring focus:border-blue-300 border-gray-300 rounded-md shadow-sm py-2 px-4 block w-full sm:text-sm"
            }
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-red-500 text-sm">{formik.errors.email}</div>
          )}
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            className={
              formik.touched.password && formik.errors.password
                ? "border-red-500"
                : "placeholder-gray text-gray border border-gray focus:outline-none focus:ring focus:border-blue-300 border-gray-300 rounded-md shadow-sm py-2 px-4 block w-full sm:text-sm"
            }
          />
          {formik.touched.password && formik.errors.password && (
            <div className="text-red-500 text-sm">{formik.errors.password}</div>
          )}
          <div>
            <select
              id="role"
              name="role"
              value={formik.values.role}
              onChange={formik.handleChange}
              required
              className="placeholder-gray text-gray border border-gray focus:outline-none focus:ring focus:border-blue-300 border-gray-300 rounded-md"
            >
              <option value="" disabled>
                Select role
              </option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
            </select>
            {formik.touched.role && formik.errors.role ? (
              <div className="text-red-500 text-sm">{formik.errors.role}</div>
            ) : null}
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-400 rounded-lg text-white cursor-pointer font-bold px-6 py-2"
          >
            Register
          </button>
          {error && (
            <div className="bg-red-500 text-white w-fit text-sm py-1 px-2 rounded-md mt-2">
              {error}
            </div>
          )}
          <Link className="text-sm mt-3 text-right" href={"/"}>
            already user? <span className="underline">login</span>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
