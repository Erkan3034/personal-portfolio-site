import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const BASE_URL = 'https://erkanturgut.com';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

// Netlify prerender edilen sayfaları sondaki eğik çizgili adrese 301 ile yönlendirir;
// canonical yönlendirmenin kendisini göstermemeli.
const withTrailingSlash = (p) => (p === '/' || p.endsWith('/') ? p : `${p}/`);

const setMeta = (attr, key, content) => {
    if (!content) return;
    let el = document.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
    }
    el.setAttribute('content', content);
};

const absolute = (url) => (url && url.startsWith('/') ? `${BASE_URL}${url}` : url);

const SEOHead = ({ title, description, path, image, type = 'website', jsonLd }) => {
    const location = useLocation();
    const fullUrl = `${BASE_URL}${withTrailingSlash(path || location.pathname)}`;
    const ogImage = absolute(image) || DEFAULT_IMAGE;
    const jsonLdString = jsonLd ? JSON.stringify(jsonLd) : '';

    useEffect(() => {
        const fullTitle = title ? `${title} | Erkan Turgut` : null;
        setMeta('property', 'og:type', type);
        setMeta('property', 'og:image', ogImage);
        setMeta('name', 'twitter:image', ogImage);
        setMeta('name', 'twitter:title', fullTitle);
        setMeta('name', 'twitter:description', description);

        let script = document.getElementById('page-jsonld');
        if (jsonLdString) {
            if (!script) {
                script = document.createElement('script');
                script.type = 'application/ld+json';
                script.id = 'page-jsonld';
                document.head.appendChild(script);
            }
            script.textContent = jsonLdString;
        } else if (script) {
            script.remove();
        }
    }, [title, description, type, ogImage, jsonLdString]);

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

export const SITE_URL = BASE_URL;

export default SEOHead;
