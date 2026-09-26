import { DEMO_PRODUCTS } from "@/app/data/demo/catalog";
import ProductDetailsClient from "./ProductDetailsClient";

export async function generateStaticParams() {
  return DEMO_PRODUCTS.map((p) => ({
    slug: p.slug,
  }));
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ProductDetailsClient slug={slug} />;
}
