import React, { useState } from "react";
import Layout from "../components/Layout";
import { useFormik } from "formik";
import * as Yup from "yup";
import {useMutation,gql} from '@apollo/client';
import {useRouter} from 'next/router';

const NUEVA_CUENTA = gql`
mutation nuevoUsuario($input: UsuarioInput!){
    nuevoUsuario(input:$input){
      id
      nombre
      apellido
      email
    }
  }
`;

const NuevaCuenta = () => {

    const router = useRouter();

    const [mensaje,guardarMensaje] = useState(null);

    const [nuevoUsuario] = useMutation(NUEVA_CUENTA);


  const formik = useFormik({
    initialValues: {
      nombre: "",
      apellido: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required("El nombre es obligatorio"),
      apellido: Yup.string().required('El apellido es obligatorio'),
      email: Yup.string().email('El email no es válido').required("El email debe ser obligatorio"),
      password: Yup.string().required("El password debe ser obligatorio").min(6,"El password debe ser de al menos 6 caracteres")
    }),
    onSubmit: async(valores) => {
        const {nombre,apellido,email,password} = valores;
        try {
            const {data} = await nuevoUsuario({
                variables:{
                    input:{
                        nombre,
                        apellido,
                        email,
                        password
                    }
                }
            });
            guardarMensaje(`Se creo correctamente el Usuario: ${data.nuevoUsuario.nombre}`);
            setTimeout(()=>{
                guardarMensaje(null);
                router.push("/login");
            },3000)
        } catch (error) {
            guardarMensaje(error.message);
            setTimeout(()=>{
                guardarMensaje(null);
            },3000)
        }
      nuevoUsuario
    },
  });

  const { nombre, apellido, email, password } = formik.values;

  const monstrarMensaje =()=>{
      return(
        <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
            <p>{mensaje}</p>
        </div>
      )
  }

  return (
    <Layout>
      <h1 className="text-center text-2xl text-white font-light">
        Nueva Cuenta
      </h1>
      {mensaje && monstrarMensaje()}
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-sm">
          <form
            onSubmit={formik.handleSubmit}
            className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
          >
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="nombre"
              >
                Nombre
              </label>
              <input
                id="nombre"
                value={nombre}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                type="text"
                placeholder="Nombre Usuario"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            {formik.touched.nombre && formik.errors.nombre && (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.nombre}</p>
              </div>
            )}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="apellido"
              >
                Apellido
              </label>
              <input
                id="apellido"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={apellido}
                placeholder="Apellido Usuario"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            {formik.touched.apellido && formik.errors.apellido && (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.apellido}</p>
              </div>
            )}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                id="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={email}
                type="email"
                placeholder="Email Usuario"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.email}</p>
              </div>
            )}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={password}
                type="password"
                placeholder="Password Usuario"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            {formik.touched.password && formik.errors.password && (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.password}</p>
              </div>
            )}
            <input
              type="submit"
              className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
              value="Crear Cuenta"
            />
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default NuevaCuenta;
