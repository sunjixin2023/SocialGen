/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { Wand2, Loader2, Sparkles, Image as ImageIcon, Linkedin, Twitter, Instagram, RefreshCw, Globe } from 'lucide-react';
import { translations, Language } from './i18n';

const getApiKey = () => {
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
        // @ts-ignore
        return process.env.API_KEY;
    }
    // @ts-ignore
    return process.env.GEMINI_API_KEY;
};

type PlatformData = {
    text: string;
    imagePrompt: string;
    imageUrl?: string;
    isGeneratingImage?: boolean;
    aspectRatio: string;
};

type ContentState = {
    linkedin: PlatformData;
    twitter: PlatformData;
    instagram: PlatformData;
};

async function generateText(idea: string, tone: string, language: string) {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: `You are an expert social media manager. Create content for the following idea: "${idea}".
        The desired tone is: ${tone}.
        The output language MUST be: ${language === 'zh' ? 'Simplified Chinese' : 'English'}.

        Provide a drafted post for:
        1. LinkedIn (long-form, professional, engaging, use formatting)
        2. Twitter/X (short, punchy, under 280 characters)
        3. Instagram (visual-focused, engaging caption, includes relevant hashtags)

        Also provide a detailed image generation prompt for each platform that visually represents the post. The image prompt MUST ALWAYS be in English, regardless of the post language. The prompt should be highly descriptive for an AI image generator.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    linkedin: {
                        type: Type.OBJECT,
                        properties: {
                            text: { type: Type.STRING },
                            imagePrompt: { type: Type.STRING }
                        }
                    },
                    twitter: {
                        type: Type.OBJECT,
                        properties: {
                            text: { type: Type.STRING },
                            imagePrompt: { type: Type.STRING }
                        }
                    },
                    instagram: {
                        type: Type.OBJECT,
                        properties: {
                            text: { type: Type.STRING },
                            imagePrompt: { type: Type.STRING }
                        }
                    }
                },
                required: ["linkedin", "twitter", "instagram"]
            }
        }
    });

    return JSON.parse(response.text || "{}");
}

async function generateImage(prompt: string, aspectRatio: string, imageSize: string) {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: { parts: [{ text: prompt }] },
        config: {
            // @ts-ignore - imageConfig is valid but might not be in types
            imageConfig: {
                aspectRatio: aspectRatio,
                imageSize: imageSize
            }
        }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
    }
    throw new Error("No image generated");
}

function PlatformCard({
    platform,
    title,
    icon,
    data,
    lang,
    onUpdateText,
    onRegenerateImage
}: {
    platform: string;
    title: string;
    icon: React.ReactNode;
    data: PlatformData;
    lang: Language;
    onUpdateText: (text: string) => void;
    onRegenerateImage: (aspectRatio: string) => void;
}) {
    const [localAspect, setLocalAspect] = useState(data.aspectRatio);
    const t = translations[lang];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-2 font-semibold text-gray-900">
                    {icon}
                    {title}
                </div>
            </div>
            <div className="p-6 flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t.postCopy}</label>
                    <textarea
                        className="w-full h-48 border border-gray-200 rounded-xl p-3 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                        value={data.text}
                        onChange={e => onUpdateText(e.target.value)}
                    />
                </div>
                <div className="w-full lg:w-72 flex flex-col">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t.generatedImage}</label>
                    <div className="flex-1 bg-gray-100 rounded-xl overflow-hidden relative flex items-center justify-center min-h-[200px] border border-gray-200">
                        {data.isGeneratingImage ? (
                            <div className="flex flex-col items-center text-gray-400 p-4 text-center">
                                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                                <span className="text-sm">{t.generatingImage}</span>
                            </div>
                        ) : data.imageUrl ? (
                            <img src={data.imageUrl} alt={`${title} generated`} className="w-full h-full object-contain" />
                        ) : (
                            <div className="text-gray-400 text-sm p-4 text-center">{t.failedToLoad}</div>
                        )}
                    </div>
                    <div className="mt-4 flex gap-2">
                        <select
                            className="flex-1 border border-gray-300 rounded-lg p-2 text-sm outline-none focus:border-indigo-500 bg-white"
                            value={localAspect}
                            onChange={e => setLocalAspect(e.target.value)}
                            disabled={data.isGeneratingImage}
                        >
                            <option value="1:1">{t.aspectRatios["1:1"]}</option>
                            <option value="4:3">{t.aspectRatios["4:3"]}</option>
                            <option value="3:4">{t.aspectRatios["3:4"]}</option>
                            <option value="16:9">{t.aspectRatios["16:9"]}</option>
                            <option value="9:16">{t.aspectRatios["9:16"]}</option>
                            <option value="3:2">{t.aspectRatios["3:2"]}</option>
                            <option value="2:3">{t.aspectRatios["2:3"]}</option>
                            <option value="21:9">{t.aspectRatios["21:9"]}</option>
                        </select>
                        <button
                            onClick={() => onRegenerateImage(localAspect)}
                            disabled={data.isGeneratingImage}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors disabled:opacity-50"
                            title={t.regenerateImage}
                        >
                            <RefreshCw className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function App() {
    const [lang, setLang] = useState<Language>('en');
    const [idea, setIdea] = useState("");
    const [tone, setTone] = useState("Professional");
    const [imageSize, setImageSize] = useState("1K");
    const [isGeneratingText, setIsGeneratingText] = useState(false);
    const [content, setContent] = useState<ContentState | null>(null);

    const t = translations[lang];

    const handleGenerate = async () => {
        if (!idea) return;
        setIsGeneratingText(true);
        try {
            const textData = await generateText(idea, tone, lang);

            const initialContent: ContentState = {
                linkedin: { ...textData.linkedin, aspectRatio: "16:9", isGeneratingImage: true },
                twitter: { ...textData.twitter, aspectRatio: "16:9", isGeneratingImage: true },
                instagram: { ...textData.instagram, aspectRatio: "1:1", isGeneratingImage: true },
            };
            setContent(initialContent);

            // Trigger image generation in parallel
            generateImageForPlatform('linkedin', initialContent.linkedin.imagePrompt, initialContent.linkedin.aspectRatio);
            generateImageForPlatform('twitter', initialContent.twitter.imagePrompt, initialContent.twitter.aspectRatio);
            generateImageForPlatform('instagram', initialContent.instagram.imagePrompt, initialContent.instagram.aspectRatio);

        } catch (e) {
            console.error(e);
            alert(t.alertFailed);
        } finally {
            setIsGeneratingText(false);
        }
    };

    const generateImageForPlatform = async (platform: keyof ContentState, prompt: string, aspectRatio: string) => {
        setContent(prev => prev ? {
            ...prev,
            [platform]: { ...prev[platform], isGeneratingImage: true, aspectRatio }
        } : prev);

        try {
            const imageUrl = await generateImage(prompt, aspectRatio, imageSize);
            setContent(prev => prev ? {
                ...prev,
                [platform]: { ...prev[platform], imageUrl, isGeneratingImage: false }
            } : prev);
        } catch (e) {
            console.error(e);
            setContent(prev => prev ? {
                ...prev,
                [platform]: { ...prev[platform], isGeneratingImage: false }
            } : prev);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
            {/* Left Sidebar */}
            <div className="w-full md:w-1/3 lg:w-1/4 bg-white border-r border-gray-200 p-6 flex flex-col md:h-screen md:sticky md:top-0 overflow-y-auto z-10 shadow-sm md:shadow-none">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Wand2 className="w-6 h-6 text-indigo-600" />
                        {t.title}
                    </h1>
                    <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                        <button 
                            onClick={() => setLang('en')} 
                            className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${lang === 'en' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            EN
                        </button>
                        <button 
                            onClick={() => setLang('zh')} 
                            className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${lang === 'zh' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            中文
                        </button>
                    </div>
                </div>

                <div className="space-y-6 flex-1">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t.ideaLabel}</label>
                        <textarea
                            className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none h-32"
                            placeholder={t.ideaPlaceholder}
                            value={idea}
                            onChange={e => setIdea(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t.toneLabel}</label>
                        <select
                            className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
                            value={tone}
                            onChange={e => setTone(e.target.value)}
                        >
                            <option value="Professional">{t.tones.Professional}</option>
                            <option value="Witty">{t.tones.Witty}</option>
                            <option value="Urgent">{t.tones.Urgent}</option>
                            <option value="Inspirational">{t.tones.Inspirational}</option>
                            <option value="Educational">{t.tones.Educational}</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t.imageQualityLabel}</label>
                        <select
                            className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
                            value={imageSize}
                            onChange={e => setImageSize(e.target.value)}
                        >
                            <option value="1K">{t.imageQuality["1K"]}</option>
                            <option value="2K">{t.imageQuality["2K"]}</option>
                            <option value="4K">{t.imageQuality["4K"]}</option>
                        </select>
                    </div>
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={!idea || isGeneratingText}
                    className="mt-6 w-full bg-indigo-600 text-white font-medium py-3 px-4 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isGeneratingText ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                    {isGeneratingText ? t.generatingBtn : t.generateBtn}
                </button>
            </div>

            {/* Right Content Area */}
            <div className="flex-1 p-6 md:p-8 overflow-y-auto md:h-screen">
                {!content && !isGeneratingText && (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 min-h-[400px]">
                        <ImageIcon className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-lg">{t.emptyState}</p>
                    </div>
                )}

                {content && (
                    <div className="max-w-4xl mx-auto space-y-8 pb-12">
                        <PlatformCard
                            platform="linkedin"
                            title={t.platforms.linkedin}
                            icon={<Linkedin className="w-5 h-5 text-[#0A66C2]" />}
                            data={content.linkedin}
                            lang={lang}
                            onUpdateText={(text) => setContent(prev => prev ? { ...prev, linkedin: { ...prev.linkedin, text } } : prev)}
                            onRegenerateImage={(aspectRatio) => generateImageForPlatform('linkedin', content.linkedin.imagePrompt, aspectRatio)}
                        />
                        <PlatformCard
                            platform="twitter"
                            title={t.platforms.twitter}
                            icon={<Twitter className="w-5 h-5 text-black" />}
                            data={content.twitter}
                            lang={lang}
                            onUpdateText={(text) => setContent(prev => prev ? { ...prev, twitter: { ...prev.twitter, text } } : prev)}
                            onRegenerateImage={(aspectRatio) => generateImageForPlatform('twitter', content.twitter.imagePrompt, aspectRatio)}
                        />
                        <PlatformCard
                            platform="instagram"
                            title={t.platforms.instagram}
                            icon={<Instagram className="w-5 h-5 text-[#E1306C]" />}
                            data={content.instagram}
                            lang={lang}
                            onUpdateText={(text) => setContent(prev => prev ? { ...prev, instagram: { ...prev.instagram, text } } : prev)}
                            onRegenerateImage={(aspectRatio) => generateImageForPlatform('instagram', content.instagram.imagePrompt, aspectRatio)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

