import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl: string;
  ogType?: 'website' | 'article' | 'product';
  ogImage?: string;
  schema?: Record<string, any> | Record<string, any>[];
}

export default function SEO({
  title,
  description,
  canonicalUrl,
  ogType = 'website',
  ogImage = 'https://balanzabikes.com/images/bike_explorer_olive_1779786711803.png',
  schema,
}: SEOProps) {
  useEffect(() => {
    // 1. Update document title
    const fullTitle = `${title} | Balanza Bikes`;
    document.title = fullTitle;

    // Helper to get or create meta tag
    const updateOrCreateMeta = (attrName: string, attrVal: string, content: string) => {
      let element = document.head.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper to get or create link tag
    const updateOrCreateLink = (rel: string, href: string) => {
      let element = document.head.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // 2. Update Standard SEO Meta Tags
    updateOrCreateMeta('name', 'description', description);
    updateOrCreateMeta('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    updateOrCreateMeta('name', 'googlebot', 'index, follow');

    // 3. Update Open Graph Meta Tags (Facebook/LinkedIn/AEO Search Crawlers)
    updateOrCreateMeta('property', 'og:title', fullTitle);
    updateOrCreateMeta('property', 'og:description', description);
    updateOrCreateMeta('property', 'og:url', canonicalUrl);
    updateOrCreateMeta('property', 'og:type', ogType);
    updateOrCreateMeta('property', 'og:image', ogImage);
    updateOrCreateMeta('property', 'og:site_name', 'Balanza Bikes');

    // 4. Update Twitter Card Meta Tags
    updateOrCreateMeta('name', 'twitter:card', 'summary_large_image');
    updateOrCreateMeta('name', 'twitter:title', fullTitle);
    updateOrCreateMeta('name', 'twitter:description', description);
    updateOrCreateMeta('name', 'twitter:image', ogImage);
    updateOrCreateMeta('name', 'twitter:site', '@Balanzabikes');

    // 5. Update Canonical Link
    updateOrCreateLink('canonical', canonicalUrl);

    // 6. Manage Dynamic JSON-LD Schema
    const schemaScriptId = 'balanza-jsonld-schema';
    let scriptElement = document.getElementById(schemaScriptId) as HTMLScriptElement | null;
    
    if (schema) {
      if (!scriptElement) {
        scriptElement = document.createElement('script');
        scriptElement.id = schemaScriptId;
        scriptElement.type = 'application/ld+json';
        document.head.appendChild(scriptElement);
      }
      scriptElement.textContent = JSON.stringify(schema, null, 2);
    } else {
      if (scriptElement) {
        scriptElement.remove();
      }
    }

    // Cleanup logic to prevent memory leaks or stale attributes on page unmount
    return () => {
      // Keep static tags, but allow cleanup of schema if needed.
    };
  }, [title, description, canonicalUrl, ogType, ogImage, schema]);

  return null; // This is a logic-only SEO side-effect component
}
