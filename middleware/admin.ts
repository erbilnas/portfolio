async function fetchAdminMe() {
  if (import.meta.server) {
    const headers = useRequestHeaders(["cookie"]);
    return await $fetch("/api/admin/me", { headers });
  }
  return await $fetch("/api/admin/me");
}

export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === "/admin/login") {
    return;
  }

  try {
    await fetchAdminMe();
  } catch {
    return navigateTo("/admin/login");
  }
});
