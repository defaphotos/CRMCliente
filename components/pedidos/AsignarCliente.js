import React, { useState, useEffect, useContext } from "react";
import Select from "react-select";
import {gql,useQuery} from '@apollo/client';
import PedidoContext from '../../context/pedidos/PedidoContext';

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

const AsignarCliente = () => {

  const { data, loading, error } = useQuery(OBTENER_CLIENTES_USUARIO);

  const {agregarCliente} = useContext(PedidoContext);

  const [cliente,guardarCliente]= useState([]);

  useEffect(()=>{
    agregarCliente(cliente);
  },[cliente])

  if(loading){
    return null;
  }

  const {obtenerClientesVendedor} = data;

  const seleccionarCliente = (clientes) => {
    guardarCliente(clientes);
  };


  return (
    <>
    <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">1.- Asigna un Cliente al pedido</p>
    <Select
    className="mt-3"
      options={obtenerClientesVendedor}
      getOptionValue={(opciones) => opciones.id}
      getOptionLabel={(opciones) => opciones.nombre}
      onChange={(opcion) => seleccionarCliente(opcion)}
      placeholder="Seleccione un cliente"
      noOptionsMessage={() => "No hay resultados"}
    />
    </>
  );
};

export default AsignarCliente;
