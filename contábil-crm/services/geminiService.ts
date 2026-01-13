
import { GoogleGenAI, Type } from "@google/genai";
import { FormModel } from "../types";

const modelName = 'gemini-3-flash-preview';

export const getAiClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API_KEY não configurada.");
    }
    return new GoogleGenAI({ apiKey });
};

export const generateText = async (prompt: string, systemInstruction?: string) => {
    try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
                ...(systemInstruction && { systemInstruction })
            }
        });
        return response.text || "Sem resposta da IA.";
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return "Desculpe, ocorreu um erro ao contatar a IA.";
    }
};

export const extractFormFromFile = async (base64Data: string, mimeType: string): Promise<FormModel> => {
    const ai = getAiClient();
    
    const prompt = "Analise este documento (que pode ser um formulário em PDF ou uma estrutura de planilha) e extraia todos os campos de entrada, perguntas e opções. Retorne um objeto JSON que siga exatamente a interface FormModel: { name: string, description: string, fields: Array<{ label: string, type: 'text' | 'textarea' | 'select' | 'date' | 'number', required: boolean, options?: string[] }> }";

    const response = await ai.models.generateContent({
        model: modelName,
        contents: [
            {
                inlineData: {
                    data: base64Data,
                    mimeType: mimeType
                }
            },
            { text: prompt }
        ],
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    fields: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                label: { type: Type.STRING },
                                type: { type: Type.STRING, enum: ['text', 'textarea', 'select', 'date', 'number'] },
                                required: { type: Type.BOOLEAN },
                                options: { type: Type.ARRAY, items: { type: Type.STRING } }
                            },
                            required: ['label', 'type', 'required']
                        }
                    }
                },
                required: ['name', 'description', 'fields']
            }
        }
    });

    try {
        return JSON.parse(response.text || '{}') as FormModel;
    } catch (e) {
        throw new Error("Falha ao processar a resposta da IA.");
    }
};
