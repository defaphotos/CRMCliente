import React, { useEffect } from "react";
import Layout from "../components/Layout";

import { gql, useQuery } from "@apollo/client";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const OBTENER_MEJORES_CLIENTES = gql`
  query mejoresClientes {
    mejoresClientes {
      total
      cliente {
        nombre
      }
    }
  }
`;
const MejoresClientes = () => {
  const { data, loading, error, startPolling, stopPolling } = useQuery(
    OBTENER_MEJORES_CLIENTES
  );

  useEffect(() => {
    startPolling(1000);
    return () => {
      stopPolling();
    };
  }, [startPolling, stopPolling]);

  if (loading) {
    return "Cargando...";
  }

  const { mejoresClientes } = data;

  const clienteGrafica = [];

  mejoresClientes.map((cliente, index) => {
    clienteGrafica[index] = {
      total: cliente.total,
      ...cliente.cliente[0],
    };
  });

  console.log(clienteGrafica);

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Mejores Clientes</h1>
      <ResponsiveContainer width={'99%'} height={550}>
        <BarChart
          className="mt-10"
          width={600}
          height={500}
          data={clienteGrafica}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="nombre" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="total" fill="#3182CE" />
        </BarChart>
      </ResponsiveContainer>
    </Layout>
  );
};

export default MejoresClientes;
