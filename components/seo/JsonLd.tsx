export function JsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        name: "Toque",
        url: baseUrl,
      },
      {
        "@type": "SoftwareApplication",
        name: "Toque",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        description:
          "Plataforma de gestión de reseñas, NFC y feedback de empleados para negocios.",
        url: baseUrl,
        publisher: { "@id": `${baseUrl}/#organization` },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
