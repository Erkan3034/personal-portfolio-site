import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SEOHead = ({ title, description, path }) => {
    const location = useLocation();
    const baseUrl = 'https://erkanturgut.com';
    const fullUrl = `${baseUrl}${path || location.pathname}`;

    useEffect(() => {
        // Update Title
        if (title) {
            document.title = `${title} | Erkan Turgut`;
        }

        // Update Meta Description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription && description) {
            metaDescription.setAttribute('content', description);
        }

        // Update Canonical URL
        let canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) {
            canonical.setAttribute('href', fullUrl);
        }

        // Update Open Graph tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle && title) ogTitle.setAttribute('content', `${title} | Erkan Turgut`);

        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription && description) ogDescription.setAttribute('content', description);

        const ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) ogUrl.setAttribute('content', fullUrl);

    }, [title, description, fullUrl]);

    return null;
};

export default SEOHead;
