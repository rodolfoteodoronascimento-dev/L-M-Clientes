
import { EKontrollResponse } from '../types';

const BASE_URL = 'http://app.e-kontroll.com.br/api'; // Ajustado para suposto endpoint de API

export const fetchEKontrollClients = async (token: string): Promise<EKontrollResponse> => {
    try {
        // Simulação de chamada de API, pois endpoint pode não ser público/acessível via browser sem CORS
        // Em produção, isso seria:
        /*
        const response = await fetch(`${BASE_URL}/clientes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // ou 'X-API-KEY': token
                'X-Token': token
            }
        });
        if (!response.ok) throw new Error('Falha na API');
        return await response.json();
        */

        // Simulando delay de rede
        await new Promise(resolve => setTimeout(resolve, 800));

        // Mock de dados baseado no token fornecido pelo usuário
        if (token === 'mMoFclhlSCJ5LxJNTcIn3sKizKESTAHNzAexOdUavbQ8KRNwv81X8LDtydi7' || token === 'mV08WXIftcagK0mDjixepuF2fVBbffuFa3eaulDKM9qC2BY7oCmOItiSPx0h') {
            return {
                data: [
                    {
                        id: 501,
                        razao_social: 'Indústrias Metalúrgicas Ltda',
                        nome_fantasia: 'MetalForte',
                        cnpj_cpf: '22.333.444/0001-55',
                        email_contato: 'financeiro@metalforte.com.br',
                        telefone_contato: '(11) 4002-8922',
                        endereco_cidade: 'Guarulhos',
                        endereco_uf: 'SP',
                        valor_mensalidade: 4500.00,
                        data_cadastro: '2023-11-15',
                        status: 'ATIVO'
                    },
                    {
                        id: 502,
                        razao_social: 'Clínica Saúde & Bem Estar S/S',
                        nome_fantasia: 'Clínica Saúde',
                        cnpj_cpf: '33.444.555/0001-66',
                        email_contato: 'contato@saudeebemestar.com',
                        telefone_contato: '(21) 99888-7777',
                        endereco_cidade: 'Niterói',
                        endereco_uf: 'RJ',
                        valor_mensalidade: 2200.00,
                        data_cadastro: '2024-01-20',
                        status: 'ATIVO'
                    },
                    {
                        id: 503,
                        razao_social: 'Comércio de Bebidas Silva',
                        nome_fantasia: 'Adega do Silva',
                        cnpj_cpf: '44.555.666/0001-77',
                        email_contato: 'silva@adega.com',
                        telefone_contato: '(31) 3333-4444',
                        endereco_cidade: 'Contagem',
                        endereco_uf: 'MG',
                        valor_mensalidade: 1100.00,
                        data_cadastro: '2024-02-10',
                        status: 'PENDENTE'
                    }
                ]
            };
        }

        return { data: [] };

    } catch (error) {
        console.error("Erro ao buscar dados do e-Kontroll:", error);
        throw error;
    }
};
