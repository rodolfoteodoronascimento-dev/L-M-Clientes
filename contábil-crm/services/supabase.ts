
import { createClient } from '@supabase/supabase-js';

// Essas variáveis devem ser configuradas no seu ambiente Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://sua-url.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'sua-chave-anon';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const db = {
    clients: {
        getAll: async () => {
            const { data, error } = await supabase.from('clients').select('*').order('company_name');
            if (error) throw error;
            return data;
        },
        create: async (client: any) => {
            const { data, error } = await supabase.from('clients').insert(client).select().single();
            if (error) throw error;
            return data;
        }
    },
    tasks: {
        getAll: async () => {
            const { data, error } = await supabase.from('tasks').select('*, clients(company_name)');
            if (error) throw error;
            return data;
        }
    }
};
