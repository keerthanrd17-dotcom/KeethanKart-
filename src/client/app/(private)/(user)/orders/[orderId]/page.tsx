import OrderTrackingClient from "./OrderTrackingClient";

export async function generateStaticParams() {
  return [
    {
      orderId: "demo-order",
    },
  ];
}

export default async function OrderTrackingPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  return <OrderTrackingClient orderId={orderId} />;
}
