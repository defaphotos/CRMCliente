import React, { useState, useEffect, useContext } from "react";
import Select from "react-select";
import { gql, useQuery } from "@apollo/client";
import PedidoContext from "../../context/pedidos/PedidoContext";

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

const AsignarProductos = () => {
  const { data, loading, error } = useQuery(OBTENER_PRODUCTOS);

  if (loading) {
    return null;
  }

  const { agregarProductos } = useContext(PedidoContext);

  const { obtenerProductos } = data;

  const seleccionarProducto = (opciones) => {
    agregarProductos(opciones);
  };

  return (
    <>
      <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">
        2.- Asigna Productos al pedido
      </p>
      <Select
        className="mt-3"
        options={obtenerProductos}
        isMulti={true}
        getOptionValue={(opciones) => opciones.id}
        getOptionLabel={(opciones) =>
          `${opciones.nombre} - ${opciones.existencia} disponibles`
        }
        onChange={(opcion) => seleccionarProducto(opcion)}
        placeholder="Seleccione productos"
        noOptionsMessage={() => "No hay resultados"}
      />
    </>
  );
};

export default AsignarProductos;
