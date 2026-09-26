import LogDetailsClient from "./LogDetailsClient";

export async function generateStaticParams() {
  return [
    {
      logId: "demo-log",
    },
  ];
}

export default async function LogDetailsPage({
  params,
}: {
  params: Promise<{ logId: string }>;
}) {
  const { logId } = await params;
  return <LogDetailsClient logId={logId} />;
}
