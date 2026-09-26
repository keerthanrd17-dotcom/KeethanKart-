import { DEMO_PRODUCTS } from "@/app/data/demo/catalog";
import ManageProductClient from "./ManageProductClient";

export async function generateStaticParams() {
  return DEMO_PRODUCTS.map((p) => ({
    id: p.id,
  }));
}

export default async function ManageProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ManageProductClient id={id} />;
}
