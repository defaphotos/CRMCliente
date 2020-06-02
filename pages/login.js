import React,{useState} from "react";
import Layout from "../components/Layout";
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {gql,useMutation} from '@apollo/client';
import {useRouter} from 'next/router'

const AUTENTICAR_USUARIO = gql`
mutation autenticarUsuario($input: AutenticarInput){
    autenticarUsuario(input: $input){
      token
    }
  }
`;

const Login = () => {

    const router = useRouter();
    
    const [autenticarUsuario] = useMutation(AUTENTICAR_USUARIO);
    const [mensaje,guardarMensaje] = useState(null);

    const formik = useFormik({
        initialValues:{
            email:'',
            password:''
        },
        validationSchema:Yup.object({
            email: Yup.string().required("El email es obligatorio").email("El email no es valido"),
            password: Yup.string().required("El password es obligatorio")
        }),
        onSubmit:async(valores)=>{
            const {email,password} = valores;
            try {
                const {data} = await autenticarUsuario({
                    variables:{
                        input:{
                            email,
                            password
                        }
                    }
                })
                guardarMensaje("Autenticando...");


                setTimeout(() => {
                  const { token } = data.autenticarUsuario;
                  localStorage.setItem('token', token);
              }, 1000);
           
              // Redireccionar hacia clientes
              setTimeout(() => {
                  guardarMensaje(null);
                  router.push('/');
              }, 2000);

               
            } catch (error) {
                guardarMensaje(error.message);
                setTimeout(()=>{
                    guardarMensaje(null);
                },3000)
            }
            
        }

    });






    const {email,password} = formik.values;


    const monstrarMensaje =()=>{
        return(
          <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
              <p>{mensaje}</p>
          </div>
        )
    }
  return (
    <Layout>
           {mensaje && monstrarMensaje()}
      <h1 className="text-center text-2xl text-white font-light">Login</h1>
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-sm">
          <form onSubmit={formik.handleSubmit} className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4">
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
                value={email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
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
                type="password"
                value={password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
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
              value="Iniciar Sesión"
            />
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
