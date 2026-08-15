export interface AdminModule {
  id: string;
  path: string;
  labelKey: string;
}

export const adminModules: AdminModule[] = [
  {
    id: "guestbook",
    path: "/admin/guestbook",
    labelKey: "admin.modules.guestbook",
  },
];
