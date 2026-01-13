
import { PipeRunResponse, PipeRunActivity, PipeRunFile } from '../types';

const BASE_URL = 'https://api.pipe.run/v1';

export const fetchPipeRunDeals = async (token: string): Promise<PipeRunResponse> => {
    try {
        const response = await fetch(`${BASE_URL}/deals?status=open&with=company,person`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            }
        });

        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erro ao buscar dados do PipeRun:", error);
        throw error;
    }
};

// Mock functions to simulate fetching details (activities and files) from PipeRun
// In a real scenario, these would hit endpoints like /deals/{id}/activities and /deals/{id}/files
export const fetchDealDetails = async (dealId: number, token: string): Promise<{ activities: PipeRunActivity[], files: PipeRunFile[] }> => {
    // Simulating API latency
    await new Promise(resolve => setTimeout(resolve, 300));

    // Mock Activities
    const activities: PipeRunActivity[] = [
        {
            id: 1,
            title: 'Reunião de Diagnóstico',
            description: 'Cliente demonstrou interesse em migrar devido a falta de atendimento no contador atual.',
            type: 'meeting',
            created_at: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString()
        },
        {
            id: 2,
            title: 'Nota sobre Tributação',
            description: 'Verificar enquadramento no Anexo III do Simples Nacional.',
            type: 'note',
            created_at: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString()
        },
        {
            id: 3,
            title: 'Email de Proposta',
            description: 'Proposta enviada com valor de honorário de R$ 1.500,00.',
            type: 'email',
            created_at: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString()
        }
    ];

    // Mock Files
    const files: PipeRunFile[] = [
        {
            id: 101,
            name: 'Contrato Social.pdf',
            url: '#',
            size: '1.2 MB',
            created_at: new Date().toISOString()
        },
        {
            id: 102,
            name: 'Proposta_Comercial_v2.pdf',
            url: '#',
            size: '850 KB',
            created_at: new Date().toISOString()
        }
    ];

    return { activities, files };
};
