import React from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Formik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

const OBTENER_PRODUCTO = gql`
  query obtenerProducto($id: ID!) {
    obtenerProducto(id: $id) {
      id
      nombre
      existencia
      precio
      creado
    }
  }
`;

const ACTUALIZAR_PRODUCTO = gql`
mutation actualizarProducto($id: ID!,$input: ProductoInput){
    actualizarProducto(id: $id,input:$input){
      id
      nombre
      existencia
      precio
      creado
    }
  }
`;

const EditarProducto = () => {
  const router = useRouter();
  const [actualizarProducto] = useMutation(ACTUALIZAR_PRODUCTO);

  const {
    query: { id },
  } = router;

  const { data, loading, error } = useQuery(OBTENER_PRODUCTO, {
    variables: {
      id,
    },
  });

  const validationSchema = Yup.object({
    nombre: Yup.string().required("El nombre es obligatorio"),
    existencia: Yup.number()
      .required("La cantidad es obligatorio")
      .min(1, "La cantidad debe ser mayor a 0")
      .integer("La cantidad debe ser numeros enteros"),
    precio: Yup.number()
      .required("La existencia es obligatorio")
      .min(1, "La cantidad debe ser mayor a 0"),
  });

  const actualizarInfoProducto = async (valores) => {
    const { nombre, existencia, precio } = valores;
    try {
      await actualizarProducto({variables:{
        id,
        input: {
          nombre,
          existencia,
          precio,
        },
      }});
      Swal.fire("Actualizado", "El producto ha sido actualizado!", "success");
      router.push("/productos");
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return "Cargando...";
  }

  if(!data){
    return(
      <Layout>
        <h1>Accion no permitida</h1>
      </Layout>
    )
  }

  const { obtenerProducto } = data;

  return  (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Editar Cliente</h1>
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <Formik
            initialValues={obtenerProducto}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={(valores) => {
              actualizarInfoProducto(valores);
            }}
          >
            {(props) => {
              return (
                <form
                  onSubmit={props.handleSubmit}
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
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.nombre}
                      placeholder="Nombre Producto"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>

                  {props.touched.nombre && props.errors.nombre && (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      <p className="font-bold">Error</p>
                      <p>{props.errors.nombre}</p>
                    </div>
                  )}
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="existencia"
                    >
                      Cantidad de Productos
                    </label>
                    <input
                      id="existencia"
                      type="number"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.existencia}
                      placeholder="Cantidad de Productos"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  {props.touched.existencia && props.errors.existencia && (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      <p className="font-bold">Error</p>
                      <p>{props.errors.existencia}</p>
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
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.precio}
                      placeholder="Precio Producto"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  {props.touched.precio && props.errors.precio && (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                      <p className="font-bold">Error</p>
                      <p>{props.errors.precio}</p>
                    </div>
                  )}

                  <input
                    value="Editar Producto"
                    type="submit"
                    className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                  />
                </form>
              );
            }}
          </Formik>
        </div>
      </div>
    </Layout>
  );
};

export default EditarProducto;
