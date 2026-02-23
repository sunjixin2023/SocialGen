import { useState, useEffect } from 'react';

export function ApiKeyCheck({ children }: { children: React.ReactNode }) {
    const [hasKey, setHasKey] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        if (window.aistudio?.hasSelectedApiKey) {
            window.aistudio.hasSelectedApiKey().then(has => {
                setHasKey(has);
                setChecking(false);
            });
        } else {
            setHasKey(true);
            setChecking(false);
        }
    }, []);

    const handleSelectKey = async () => {
        if (window.aistudio?.openSelectKey) {
            await window.aistudio.openSelectKey();
            setHasKey(true);
        }
    };

    if (checking) return null;

    if (!hasKey) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 font-sans">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8 text-center border border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">API Key Required</h1>
                    <p className="text-gray-600 mb-6">
                        This application uses high-quality image generation models which require a paid Google Cloud API key.
                        <br /><br />
                        <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline font-medium">Learn more about billing</a>
                    </p>
                    <button
                        onClick={handleSelectKey}
                        className="w-full bg-indigo-600 text-white font-medium py-3 px-4 rounded-xl hover:bg-indigo-700 transition-colors"
                    >
                        Select API Key
                    </button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
