"use client";

import { useEffect, useState } from "react";
import { ClientePessoa } from "@/services/db/user-cliente.service";

// Hook para buscar dados do cliente no lado cliente
export function useClienteLogado() {
  const [cliente, setCliente] = useState<ClientePessoa | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCliente() {
      try {
        setLoading(true);

        // Fazer requisição para API route que busca cliente
        const response = await fetch("/api/cliente-logado");

        if (!response.ok) {
          throw new Error("Erro ao buscar dados do cliente");
        }

        const data = await response.json();
        setCliente(data.cliente);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    }

    fetchCliente();
  }, []);

  return { cliente, loading, error };
}

// Componente de exemplo para usar em páginas client-side
export function ClienteInfo() {
  const { cliente, loading, error } = useClienteLogado();

  if (loading) return <div>Carregando dados do cliente...</div>;
  if (error) return <div>Erro: {error}</div>;
  if (!cliente) return <div>Nenhum cliente associado</div>;

  return (
    <div className="rounded-lg bg-blue-50 p-4">
      <h3 className="font-semibold text-blue-800">Cliente Logado:</h3>
      <p className="text-blue-600">ID: {cliente.id}</p>
      <p className="text-blue-600">Nome: {cliente.nome}</p>
      <p className="text-blue-600">Email: {cliente.email}</p>
    </div>
  );
}
