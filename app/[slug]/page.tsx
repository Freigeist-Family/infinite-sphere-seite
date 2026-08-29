import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTouchpoint, getTouchpointSlugs } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return getTouchpointSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!getTouchpointSlugs().includes(slug)) return {};
  const tp = getTouchpoint(slug);
  return {
    title: { absolute: `${tp.title} — Archiv · infinite sphere` },
    robots: { index: false, follow: true },
    alternates: { canonical: tp.canonical },
  };
}

export default async function TouchpointPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!getTouchpointSlugs().includes(slug)) notFound();
  const tp = getTouchpoint(slug);

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link rel="stylesheet" href="/assets/touchpoint.css" precedence="default" />
      <main dangerouslySetInnerHTML={{ __html: tp.main }} />
    </>
  );
}
