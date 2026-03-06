import { GoogleGenerativeAI } from '@google/generative-ai';
import { useCallback, useState } from 'react';

// Note: Replace with actual secure key management in production or environment variable.
const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || 'YOUR_API_KEY_HERE';
const genAI = new GoogleGenerativeAI(API_KEY);

interface GeminiOptions {
    model?: string;
}

export function useGemini(options?: GeminiOptions) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // We explicitly use the 3 Flash model as requested for speed and token saving
    const model = genAI.getGenerativeModel({ model: options?.model || 'gemini-3.0-flash' });

    const fetchDictionary = useCallback(async (word: string, vibe: 'street' | 'faith') => {
        setLoading(true);
        setError(null);

        const systemPrompt = `You are a Northern Thai script & culture expert building a dictionary.
Response MUST be valid JSON only. NO markdown blocks.
Format: { "word": string, "meaning": string, "script": string, "culturalNote": string, "vibe": "${vibe}" }

Vibe context:
- "street": Focus on Northern Thai (Kam Mueang) usage, daily life.
- "faith": Focus on Biblical/Church Thai (Standard, THSV11) with a Northern twist.
`;

        const userPrompt = `Provide dictionary entry for: "${word}" in ${vibe} context. Keep it minimal and highly accurate.`;

        try {
            const result = await model.generateContent([
                { text: systemPrompt },
                { text: userPrompt }
            ]);
            const responseText = result.response.text().trim();

            // Attempt to parse JSON. Might need to strip out ```json if AI disobeys
            const rawJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(rawJson);

            setLoading(false);
            return parsed;
        } catch (err: any) {
            console.error('Gemini Error:', err);
            setError(err.message || 'Failed to fetch vibe dictionary');
            setLoading(false);
            return null;
        }
    }, [model]);

    return { fetchDictionary, loading, error };
}
