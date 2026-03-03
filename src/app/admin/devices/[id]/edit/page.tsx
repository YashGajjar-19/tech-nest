import { requireAdmin } from "@/lib/auth/admin";
import { getDeviceForReviewAction } from "@/app/admin/devices/actions";
import { DeviceWizard } from "@/components/admin/device-wizard/DeviceWizard";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Edit Device | Admin OS — Tech Nest",
};

export default async function EditDevicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const result = await getDeviceForReviewAction(id);

  if (!result.success || !result.data) {
    return notFound();
  }

  const device = result.data;

  return (
    <DeviceWizard
      initialDeviceId={device.id}
      initialBrandId={device.brand_id ?? undefined}
      initialBrandName={device.brand?.name ?? undefined}
    />
  );
}
