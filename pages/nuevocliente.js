import React,{useState} from "react";
import Layout from "../components/Layout";
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {gql,useMutation} from '@apollo/client';
import {useRouter} from 'next/router';
import Swal from 'sweetalert2';

const NUEVO_CLIENTE =gql`
mutation nuevoCliente($input:ClienteInput){
    nuevoCliente(input: $input){
      id
      nombre
      apellido
      empresa
      email
      telefono
      vendedor
    }
  }
`;

const OBTENER_CLIENTES_USUARIO = gql`
  query obtenerClientesVendedor {
    obtenerClientesVendedor {
      id
      nombre
      apellido
      empresa
      email
    }
  }
`;

const NuevoCliente = () => {
    const [mensaje,guardarMensaje] = useState(null);

    const router = useRouter();

    const [nuevoCliente] = useMutation(NUEVO_CLIENTE,{
        update(cache,{data:nuevoCliente }){
            //obtener el objeto de cache que deseamos actualizar
            const {obtenerClientesVendedor} = cache.readQuery({query :OBTENER_CLIENTES_USUARIO });
            //reescribir el cache
            cache.writeQuery({
                query: OBTENER_CLIENTES_USUARIO,
                data:{
                    obtenerClientesVendedor:[...obtenerClientesVendedor,nuevoCliente]
                }
            })
        }
    });

    const formik = useFormik({
        initialValues:{
            nombre:'',
            apellido:'',
            empresa:'',
            email:'',
            telefono:''
        },
        validationSchema:Yup.object({
            nombre: Yup.string().required("El nombre es obligatorio"),
            apellido: Yup.string().required("El apellido es obligatorio"),
            empresa: Yup.string().required("La empresa es obligatorio"),
            email: Yup.string().required("La empresa es obligatorio").email("El campo debe ser un email"),

        }),
        onSubmit:async(valores)=>{
            const {nombre,apellido,empresa,email,telefono} = valores;
            try {
                const {data} = await nuevoCliente({
                    variables:{
                        input:{
                            nombre,
                            apellido,
                            empresa,
                            email,
                            telefono
                        }
                    }
                });

                Swal.fire(
                  'Creado',
                  'Cliente creado correctamente',
                  'success'
                )

                router.push("/");
            } catch (error) {
                guardarMensaje(error.message);
                setTimeout(()=>{
                    guardarMensaje(null);
                },3000)            }
            
        }
    });

    const {nombre,apellido,empresa,email,telefono} = formik.values;

    const monstrarMensaje =()=>{
        return(
          <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
              <p>{mensaje}</p>
          </div>
        )
    }

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Nuevo Cliente</h1>
      {mensaje && monstrarMensaje()}
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <form onSubmit={formik.handleSubmit} className="bg-white shadow-md px-8 pt-6 pb-8 mb-4">
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
                placeholder="Nombre Cliente"
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
                placeholder="Apellido Cliente"
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
                htmlFor="empresa"
              >
                Empresa
              </label>
              <input
                id="empresa"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={empresa}
                placeholder="Empresa Cliente"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            {formik.touched.empresa && formik.errors.empresa && (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.empresa}</p>
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
                type="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={email}
                placeholder="Email Cliente"
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
                htmlFor="telefono"
              >
                Telefono
              </label>
              <input
                id="telefono"
                type="tel"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={telefono}
                placeholder="Telefono Cliente"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            {formik.touched.telefono && formik.errors.telefono && (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.telefono}</p>
              </div>
            )}
            <input value="Registrar Cliente" type="submit" className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900" />
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default NuevoCliente;
