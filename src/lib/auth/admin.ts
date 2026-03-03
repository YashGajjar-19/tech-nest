import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

/**
 * Server-side utility to verify if the current user has 'admin' or 'super_admin' privileges.
 * This should be used in Server Components, Layouts, and Server Actions as an extra layer
 * of security beyond middleware.
 */
export async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/?auth=required");
  }

  const { data: roleData, error: roleError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (roleError || !roleData) {
    redirect("/");
  }

  const role = roleData.role;

  if (role !== "admin" && role !== "super_admin") {
    // If they are logged in but not an admin, send them to the home page
    redirect("/");
  }

  return { user, role };
}
