import { useEffect, useId, useState } from "react";

/**
 * Renders a ```mermaid block from an article.
 *
 * Mermaid is several hundred kilobytes, so it is imported on first use rather
 * than bundled with the article view: an article without a diagram never
 * downloads it. Colours and type follow the site rather than Mermaid's default
 * theme, so a diagram reads as part of the note and not as an embedded widget.
 */

type Status = { state: "loading" } | { state: "ready"; svg: string } | { state: "error" };

let configured: Promise<typeof import("mermaid").default> | null = null;

function loadMermaid() {
  if (!configured) {
    configured = import("mermaid").then(({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        // Article content is authored in this repository, but strict keeps
        // diagram labels from ever carrying script or clickable links.
        securityLevel: "strict",
        theme: "base",
        fontFamily: "Inter, system-ui, sans-serif",
        themeVariables: {
          fontSize: "14px",
          primaryColor: "#ffffff",
          primaryTextColor: "hsl(220 40% 10%)",
          primaryBorderColor: "hsl(220 60% 15%)",
          secondaryColor: "hsl(40 30% 96%)",
          tertiaryColor: "hsl(40 30% 96%)",
          lineColor: "hsl(215 15% 45%)",
          edgeLabelBackground: "hsl(40 30% 96%)",
        },
        flowchart: { curve: "basis", padding: 14, htmlLabels: true },
      });
      return mermaid;
    });
  }
  return configured;
}

const ArticleDiagram = ({ source }: { source: string }) => {
  // Mermaid needs a document-unique id; React's contains colons it rejects.
  const id = `diagram-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const [status, setStatus] = useState<Status>({ state: "loading" });

  useEffect(() => {
    let cancelled = false;
    loadMermaid()
      .then((mermaid) => mermaid.render(id, source))
      .then(({ svg }) => {
        if (!cancelled) setStatus({ state: "ready", svg });
      })
      .catch(() => {
        if (!cancelled) setStatus({ state: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, [id, source]);

  return (
    <figure className="not-prose my-10 overflow-x-auto rounded-lg border border-border bg-card p-5 md:p-8">
      {status.state === "ready" ? (
        <div
          // On a phone the diagram keeps a readable size and the card scrolls
          // sideways, rather than shrinking its labels below legibility.
          className="mx-auto flex w-max min-w-full justify-center [&_svg]:h-auto [&_svg]:min-w-[520px] [&_svg]:max-w-full md:[&_svg]:min-w-0"
          // Mermaid's own output, produced with securityLevel "strict".
          dangerouslySetInnerHTML={{ __html: status.svg }}
        />
      ) : status.state === "error" ? (
        // A diagram that fails to render still carries its meaning as text.
        <pre className="whitespace-pre-wrap text-sm text-muted-foreground">{source}</pre>
      ) : (
        <div className="h-64 animate-pulse rounded bg-border/60" aria-busy="true" aria-label="Loading diagram" />
      )}
    </figure>
  );
};

export default ArticleDiagram;
