"use client";

import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface FormValues {
  name: string;
  email: string;
  password: string;
}

const RegisterForm: React.FC = () => {
  const [error, setError] = useState<string>("");
  const [role, setRole] = useState('user');



  const router = useRouter();

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  });

<<<<<<< HEAD
  const formik = useFormik<FormValues>({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
=======
    if (!name || !email || !password) {
      setError("All fields are necessary.");
      return;
    }
try{
    const res = await fetch("api/router", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
>>>>>>> 94d10ca5942f8ad4b551e27dd74822ea80eba1ca

    onSubmit: async (values, { resetForm }) => {
      
      try {
        const resUserExists = await fetch("/api/userExists", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({email: values.email}),
        });
        const {user}=await resUserExists.json()
        if(user){
          setError("User already exits " )
          return
        }

        const res = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (res.ok) {
          resetForm();
          router.push("/");
        } else {
          setError("User registration failed.");
        }
      } catch (error: any) {
        setError("Error during registration: " + error.message);
        console.log(error)
      }
    },
  });

  return (
    <div className="grid place-items-center h-screen">
      <div className="shadow-lg p-6 rounded-lg border-t-4 bg-orange-200">
        <h1 className="text-xl font-bold my-4">Registration Page</h1>
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            className={formik.touched.name && formik.errors.name ? "border-red-500" : ""}
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
            className={formik.touched.email && formik.errors.email ? "border-red-500" : ""}
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
            className={formik.touched.password && formik.errors.password ? "border-red-500" : ""}
          />
          <div>
          <select
           
            value={role}
            onChange={(e) => setRole(e.target.value)}
        
            required
          >
            <option value="" disabled>Select role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
          {formik.touched.password && formik.errors.password && (
            <div className="text-red-500 text-sm">{formik.errors.password}</div>
          )}
          <button type="submit" className="bg-orange-400 text-white cursor-pointer font-bold px-6 py-2">
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
