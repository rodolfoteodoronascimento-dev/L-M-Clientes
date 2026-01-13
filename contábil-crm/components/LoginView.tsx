
import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface LoginViewProps {
    onLogin: (email: string) => void;
}

const LOGO_LIGHT_URL = "https://i.imgur.com/Lj6oSbu.png";
const LOGO_DARK_URL = "https://i.imgur.com/jn1yd0P.png";

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
    const { theme } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Simulating an API call
        setTimeout(() => {
            setIsLoading(false);
            onLogin(email);
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            <div className="w-full max-w-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-12 animate-fadeInUp relative z-10">
                <div className="flex flex-col items-center mb-10">
                    <img 
                        src={theme === 'dark' ? LOGO_DARK_URL : LOGO_LIGHT_URL} 
                        alt="L&M Contabilidade" 
                        className="h-32 w-auto object-contain mb-6"
                    />
                    <h2 className="text-4xl font-bold text-black dark:text-white mb-2">Bem-vindo de volta</h2>
                    <p className="text-zinc-500 dark:text-zinc-400 text-lg">Acesse o CRM do seu escritório</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                        <label htmlFor="email" className="block text-base font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                            E-mail ou Usuário
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-zinc-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <input
                                id="email"
                                type="text"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full pl-12 pr-4 py-4 border border-zinc-300 dark:border-zinc-700 rounded-xl leading-5 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-base transition-colors"
                                placeholder="ex: Ana Pereira ou ana@empresa.com"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label htmlFor="password" className="block text-base font-medium text-zinc-700 dark:text-zinc-300">
                                Senha
                            </label>
                            <a href="#" className="text-sm font-medium text-primary hover:text-primary-dark transition-colors">
                                Esqueceu a senha?
                            </a>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-zinc-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full pl-12 pr-4 py-4 border border-zinc-300 dark:border-zinc-700 rounded-xl leading-5 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-base transition-colors"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-bold text-zinc-900 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-light hover:to-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:cursor-wait transition-all transform active:scale-[0.98]"
                    >
                        {isLoading ? (
                            <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-zinc-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : 'Entrar na Plataforma'}
                    </button>
                </form>
            </div>
            
            <p className="absolute bottom-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
                &copy; {new Date().getFullYear()} Contábil CRM. Todos os direitos reservados.
            </p>
        </div>
    );
};
