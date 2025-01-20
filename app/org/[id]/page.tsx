import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const organizationId = (await params).id;
  redirect(`/org/${organizationId}/people`);
}
