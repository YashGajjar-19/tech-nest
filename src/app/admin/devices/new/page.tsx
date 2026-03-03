import { requireAdmin } from "@/lib/auth/admin";
import { DeviceWizard } from "@/components/admin/device-wizard/DeviceWizard";

export const metadata = {
  title: "New Device | Admin OS — Tech Nest",
  description: "Add a new device to the Tech Nest intelligence database.",
};

export default async function NewDevicePage() {
  await requireAdmin();

  return <DeviceWizard />;
}
