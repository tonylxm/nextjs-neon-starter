// Escaping "<" stops a value containing "</script>" from closing the tag.
export function JsonLd({ data }: { data: object }): React.JSX.Element {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
