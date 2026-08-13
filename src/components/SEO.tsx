import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  noindex?: boolean;
  /** Emits a Service entity. Use on the job pages under /what-we-solve. */
  service?: { name: string; serviceType: string };
  /** Emits a FAQPage entity. Use on /security, where IT arrives with questions. */
  faq?: { q: string; a: string }[];
  /** Emits a BreadcrumbList. Pass the trail excluding Home. */
  breadcrumbs?: { name: string; url: string }[];
}

const SITE_NAME = 'VibeOps';
const SITE_URL = 'https://www.vibeops.ca';
const DEFAULT_OG_IMAGE = '/app-preview.png';

function generateArticleSchema(props: {
  title: string;
  description: string;
  canonical: string;
  imageUrl: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: props.title,
    description: props.description,
    image: props.imageUrl,
    url: props.canonical,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/Logo-blk-hrzntl.jpeg`,
      },
    },
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': props.canonical,
    },
  };
}

function generateServiceSchema(
  svc: { name: string; serviceType: string },
  description: string,
  canonical?: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: svc.name,
    serviceType: svc.serviceType,
    description,
    ...(canonical ? { url: canonical } : {}),
    areaServed: [
      { '@type': 'Country', name: 'United States' },
      { '@type': 'Country', name: 'Canada' },
    ],
    audience: {
      '@type': 'Audience',
      audienceType: 'Architecture and engineering firms',
    },
    provider: {
      '@type': 'Organization',
      name: 'VibeOps Technologies Inc.',
      url: SITE_URL,
    },
  };
}

function generateFaqSchema(faq: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

function generateBreadcrumbSchema(trail: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      ...trail.map((t, i) => ({
        '@type': 'ListItem',
        position: i + 2,
        name: t.name,
        item: t.url.startsWith('http') ? t.url : `${SITE_URL}${t.url}`,
      })),
    ],
  };
}

export function SEO({
  title,
  description,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  noindex = false,
  service,
  faq,
  breadcrumbs,
}: SEOProps) {
  // VibeOps always leads the tab title
  const fullTitle = title === SITE_NAME ? title : `VibeOps | ${title}`;
  const imageUrl = ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      {canonical && <link rel="canonical" href={canonical} />}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      {ogType === 'article' && canonical && (
        <script type="application/ld+json">
          {JSON.stringify(generateArticleSchema({
            title: fullTitle,
            description,
            canonical,
            imageUrl,
          }))}
        </script>
      )}
      {service && (
        <script type="application/ld+json">
          {JSON.stringify(generateServiceSchema(service, description, canonical))}
        </script>
      )}
      {faq && faq.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify(generateFaqSchema(faq))}
        </script>
      )}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify(generateBreadcrumbSchema(breadcrumbs))}
        </script>
      )}
    </Helmet>
  );
}
