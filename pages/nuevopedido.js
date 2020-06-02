import React, { useContext, useState } from "react";
import Layout from "../components/layout";
import AsignarCliente from "../components/pedidos/AsignarCliente";
import AsignarProductos from "../components/pedidos/AsignarProductos";
import ResumenPedido from "../components/pedidos/ResumenPedido";
import Total from "../components/pedidos/Total";
import PedidoContext from "../context/pedidos/PedidoContext";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

const NUEVO_PEDIDO = gql`
  mutation nuevoPedido($input: PedidoInput) {
    nuevoPedido(input: $input) {
      id
      pedido {
        id
        cantidad
      }
      total
      cliente {
        nombre
      }
      vendedor
      estado
      creado
    }
  }
`;

const OBTENER_PEDIDOS_VENDEDOR = gql`
  query obtenerPedidosVendedor {
    obtenerPedidosVendedor {
      id
      pedido {
        id
        cantidad
        nombre
      }
      total
      cliente {
        id
        nombre
        apellido
        telefono
        email
      }
      vendedor
      estado
      creado
    }
  }
`;

const NuevoPedido = () => {
  const [nuevoPedido] = useMutation(NUEVO_PEDIDO, {
    update(cache, { data: { nuevoPedido } }) {
      const { obtenerPedidosVendedor } = cache.readQuery({
        query: OBTENER_PEDIDOS_VENDEDOR,
      });

      cache.writeQuery({
        query: OBTENER_PEDIDOS_VENDEDOR,
        data: [...obtenerPedidosVendedor, nuevoPedido],
      });
    },
  });

  const [mensaje, guardarMensaje] = useState(null);

  const router = useRouter();

  const { cliente, productos, total } = useContext(PedidoContext);
  const validarPedido = () => {
    return !productos.every((producto) => producto.cantidad > 0) ||
      total === 0 ||
      cliente.length === 0
      ? "opacity-50 cursor-not-allowed"
      : "";
  };

  const crearNuevoPedido = async () => {
    const { id } = cliente;

    const pedido = productos.map(
      ({ creado, precio, __typename, existencia, ...producto }) => {
        return producto;
      }
    );

    try {
      const {data} = await nuevoPedido({
        variables: {
          input: {
            cliente: id,
            total,
            pedido,
          },
        },
      });

      Swal.fire("Creado", "Pedido creado correctamente", "success");

      router.push("/pedidos");
    } catch (error) {
      guardarMensaje(error.message);
    }
  };

  const monstrarMensaje = () => {
    return (
      <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
        <p>{mensaje}</p>
      </div>
    );
  };

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Nuevo Pedido</h1>
      {mensaje && monstrarMensaje()}

      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <AsignarCliente />
          <AsignarProductos />
          <ResumenPedido />
          <Total />
          <button
            onClick={() => crearNuevoPedido()}
            type="button"
            className={`bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 ${validarPedido()}`}
          >
            Registrar Pedido
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default NuevoPedido;
