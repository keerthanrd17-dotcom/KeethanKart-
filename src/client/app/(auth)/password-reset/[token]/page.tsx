import PasswordResetClient from "./PasswordResetClient";

export async function generateStaticParams() {
  return [
    {
      token: "demo-token",
    },
  ];
}

export default async function PasswordResetPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <PasswordResetClient token={token} />;
}
