import React, { useState } from "react";
import Layout from "../components/Layout";
import { useFormik } from "formik";
import * as Yup from "yup";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import Swal from 'sweetalert2';
const NUEVO_PRODUCTO = gql`
  mutation nuevoProducto($input: ProductoInput) {
    nuevoProducto(input: $input) {
      id
      nombre
      existencia
      precio
      creado
    }
  }
`;

const OBTENER_PRODUCTOS = gql`
  query obtenerProductos {
    obtenerProductos {
      id
      nombre
      existencia
      precio
      creado
    }
  }
`;

const NuevoProducto = () => {
  const router = useRouter();
  const [mensaje, guardarMensaje] = useState(null);

  const [nuevoProducto] = useMutation(NUEVO_PRODUCTO, {
    update(cache, { data: { nuevoProducto } }) {
      const { obtenerProductos } = cache.readQuery({query: OBTENER_PRODUCTOS,});

      cache.writeQuery({
        query: OBTENER_PRODUCTOS,
        data: { obtenerProductos: [...obtenerProductos, nuevoProducto] },
      });
    },
  });

  const formik = useFormik({
    initialValues: {
      nombre: "",
      existencia: 0,
      precio: 0,
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required("El nombre es obligatorio"),
      existencia: Yup.number()
        .required("La cantidad es obligatorio")
        .min(1, "La cantidad debe ser mayor a 0")
        .integer("La cantidad debe ser numeros enteros"),
      precio: Yup.number()
        .required("La existencia es obligatorio")
        .min(1, "La cantidad debe ser mayor a 0"),
    }),
    onSubmit: async (valores) => {
      const { nombre, existencia, precio } = valores;
      try {
        const { data } = await nuevoProducto({
          variables: {
            input: {
              nombre,
              existencia,
              precio,
            },
          },
        });
        Swal.fire(
          'Creado',
          'Producto creado correctamente',
          'success'
        )
        router.push("/productos");
      } catch (error) {
        guardarMensaje(error.message);
        setTimeout(() => {
          guardarMensaje(null);
        }, 3000);
      }
    },
  });

  const monstrarMensaje = () => {
    return (
      <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
        <p>{mensaje}</p>
      </div>
    );
  };

  const { nombre, existencia, precio } = formik.values;
  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Nuevo Producto</h1>
      {mensaje && monstrarMensaje()}
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <form
            onSubmit={formik.handleSubmit}
            className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
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
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={nombre}
                placeholder="Nombre Producto"
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
                htmlFor="existencia"
              >
                Cantidad Disponible
              </label>
              <input
                id="existencia"
                type="number"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={existencia}
                placeholder="Existencia Producto"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            {formik.touched.existencia && formik.errors.existencia && (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.existencia}</p>
              </div>
            )}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="precio"
              >
                Precio
              </label>
              <input
                id="precio"
                type="number"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={precio}
                placeholder="Precio Producto"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            {formik.touched.precio && formik.errors.precio && (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.precio}</p>
              </div>
            )}

            <input
              value="Registrar Producto"
              type="submit"
              className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
            />
          </form>
        </div>
      </div>{" "}
    </Layout>
  );
};

export default NuevoProducto;
