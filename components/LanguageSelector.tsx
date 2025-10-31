import React from 'react';

const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'ja', name: 'Japanese' },
    { code: 'zh-CN', name: 'Chinese (Simplified)' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' },
    { code: 'it', name: 'Italian' },
];

interface LanguageSelectorProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ value, onChange, disabled }) => {
    return (
        <div>
            <label htmlFor="language-select" className="block text-sm font-medium text-gray-400 mb-1">
                Translate To
            </label>
            <select
                id="language-select"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="w-full p-2 border border-gray-700 rounded-md shadow-sm bg-gray-800 text-gray-200 focus:ring-2 focus:ring-cyan-500 disabled:bg-gray-700 disabled:cursor-not-allowed"
            >
                {languages.map(lang => (
                    <option key={lang.code} value={lang.name}>
                        {lang.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default LanguageSelector;