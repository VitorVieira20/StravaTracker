import { usePage } from '@inertiajs/react';

export default function useTranslation() {
    const { props } = usePage();
    const translations = props.translations || {};

    const t = (key, replacements = {}) => {
        let translation = translations[key] || key;

        Object.keys(replacements).forEach(r => {
            translation = translation.replace(`:${r}`, replacements[r]);
        });

        return translation;
    };

    const locale = props.locale || 'en';

    return { t, locale };
}