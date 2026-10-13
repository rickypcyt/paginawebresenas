async function api(method: string, url: string, body?: unknown) {
  const r = await fetch(url, {
    method,
    headers: body instanceof FormData ? undefined : { "Content-Type": "application/json" },
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });
  if (!r.ok) {
    const msg = await r.text().catch(() => "");
    throw Object.assign(new Error(msg || r.statusText), {
      userMessage: "No se pudo guardar. Inténtalo de nuevo.",
    });
  }
  return r.status === 204 ? {} : r.json().catch(() => ({}));
}

/* ---------------- DUEÑO ---------------- */
export const ownerHooks = {
  saveProfile: async ({
    business,
    logo,
  }: {
    business: { id: string } & Record<string, unknown>;
    owner: Record<string, unknown>;
    logo: File | null;
  }) => {
    let imageUrl = business.imageUrl as string | undefined;
    if (logo) {
      const form = new FormData();
      form.append("file", logo);
      const r = await fetch(`/api/businesses/${business.id}/upload`, {
        method: "POST",
        body: form,
        credentials: "include",
      });
      if (!r.ok) throw Object.assign(new Error("Error subiendo logo"), { userMessage: "No se pudo subir el logo." });
      const data = (await r.json()) as { url: string };
      imageUrl = data.url;
    }
    return api("PATCH", `/api/businesses/${business.id}`, { ...business, imageUrl });
  },

  acceptJoin: async ({ request }: { request: { id: string; businessId?: string } }) => {
    const businessId = request.businessId;
    if (!businessId) throw new Error("Falta businessId");
    return api("PATCH", `/api/businesses/${businessId}/join-requests/${request.id}`, { action: "approve" });
  },

  rejectJoin: async ({ request }: { request: { id: string; businessId?: string } }) => {
    const businessId = request.businessId;
    if (!businessId) throw new Error("Falta businessId");
    return api("PATCH", `/api/businesses/${businessId}/join-requests/${request.id}`, { action: "reject" });
  },

  toggleEmployee: async ({ employee, active }: { employee: { id: string; businessId?: string }; active: boolean }) => {
    const businessId = employee.businessId;
    if (!businessId) throw new Error("Falta businessId");
    return api("PATCH", `/api/businesses/${businessId}/employees/${employee.id}`, { active });
  },

  saveEmployee: async ({
    employee,
    isNew,
  }: {
    employee: { id?: string; businessId?: string } & Record<string, unknown>;
    isNew: boolean;
  }) => {
    const businessId = employee.businessId;
    if (!businessId) throw new Error("Falta businessId");
    if (isNew) {
      return api("POST", `/api/businesses/${businessId}/employees`, employee);
    }
    return api("PATCH", `/api/businesses/${businessId}/employees/${employee.id}`, employee);
  },

  deleteEmployee: async ({ employee }: { employee: { id: string; businessId?: string } }) => {
    const businessId = employee.businessId;
    if (!businessId) throw new Error("Falta businessId");
    return api("DELETE", `/api/businesses/${businessId}/employees/${employee.id}`);
  },

  getNfcLink: async (employee: { id: string; businessId?: string }) => {
    const businessId = employee.businessId;
    if (!businessId) throw new Error("Falta businessId");
    const r = await api("POST", `/api/employees/${employee.id}/nfc-tag`, {});
    const url = `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/nfc/${(r as { token: string }).token}`;
    return url;
  },
};

/* ---------------- ADMIN ---------------- */
export const adminHooks = {
  approveRequest: async ({ request }: { request: { id: string; type: string; businessId?: string } }) => {
    if (request.type === "business") {
      return api("PATCH", `/api/business-requests/${request.id}`, { action: "approve" });
    }
    if (!request.businessId) throw new Error("Falta businessId");
    return api("PATCH", `/api/businesses/${request.businessId}/join-requests/${request.id}`, { action: "approve" });
  },

  rejectRequest: async ({ request }: { request: { id: string; type: string; businessId?: string } }) => {
    if (request.type === "business") {
      return api("PATCH", `/api/business-requests/${request.id}`, { action: "reject" });
    }
    if (!request.businessId) throw new Error("Falta businessId");
    return api("PATCH", `/api/businesses/${request.businessId}/join-requests/${request.id}`, { action: "reject" });
  },

  saveUser: async ({ user, isNew, password }: { user: { id?: string } & Record<string, unknown>; isNew: boolean; password?: string }) => {
    if (isNew) {
      return api("POST", "/api/admin/users", { ...user, password });
    }
    return api("PATCH", `/api/admin/users/${user.id}`, user);
  },

  deleteUser: async ({ user }: { user: { id: string } }) => api("DELETE", `/api/admin/users/${user.id}`),

  saveBusiness: async ({
    business,
    logo,
    isNew,
  }: {
    business: { id?: string } & Record<string, unknown>;
    logo: File | null;
    isNew: boolean;
  }) => {
    const payload = { ...business };
    if (isNew) {
      const r = (await api("POST", "/api/admin/businesses", payload)) as { business: { id: string } };
      if (logo) {
        const form = new FormData();
        form.append("file", logo);
        const up = await fetch("/api/admin/upload", { method: "POST", body: form, credentials: "include" });
        if (!up.ok) throw Object.assign(new Error("Error subiendo logo"), { userMessage: "Negocio creado, pero no se pudo subir el logo." });
        const data = (await up.json()) as { url: string };
        await api("PATCH", `/api/admin/businesses/${r.business.id}`, { imageUrl: data.url });
      }
      return r;
    }
    if (logo) {
      const form = new FormData();
      form.append("file", logo);
      const up = await fetch("/api/admin/upload", { method: "POST", body: form, credentials: "include" });
      if (!up.ok) throw Object.assign(new Error("Error subiendo logo"), { userMessage: "No se pudo subir el logo." });
      const data = (await up.json()) as { url: string };
      payload.imageUrl = data.url;
    }
    return api("PATCH", `/api/admin/businesses/${business.id}`, payload);
  },

  verifyBusiness: async ({ business }: { business: { id: string } }) =>
    api("POST", `/api/businesses/${business.id}/verify`, {}),

  deleteBusiness: async ({ business }: { business: { id: string } }) =>
    api("DELETE", `/api/admin/businesses/${business.id}`),

  saveEmployee: async ({
    employee,
    isNew,
  }: {
    employee: { id?: string; businessId?: string } & Record<string, unknown>;
    isNew: boolean;
  }) => {
    if (isNew) {
      if (!employee.businessId) throw new Error("Falta businessId");
      return api("POST", `/api/admin/employees`, employee);
    }
    return api("PATCH", `/api/admin/employees/${employee.id}`, employee);
  },

  toggleEmployee: async ({ employee, active }: { employee: { id: string }; active: boolean }) =>
    api("PATCH", `/api/admin/employees/${employee.id}`, { active }),

  deleteEmployee: async ({ employee }: { employee: { id: string } }) =>
    api("DELETE", `/api/admin/employees/${employee.id}`),

  toggleTag: async ({ tag, active }: { tag: { id: string }; active: boolean }) =>
    api("PATCH", `/api/admin/nfc-tags/${tag.id}`, { active }),

  saveTag: async ({ tag }: { tag: { id: string; label: string } }) =>
    api("PATCH", `/api/admin/nfc-tags/${tag.id}`, { label: tag.label }),

  saveReview: async ({ review }: { review: { id: string; msg?: string; rating?: number; title?: string } }) =>
    api("PATCH", `/api/admin/reviews/${review.id}`, {
      title: review.title || review.msg?.slice(0, 50) || "Sin título",
      content: review.msg,
      rating: review.rating,
    }),

  deleteReview: async ({ review }: { review: { id: string } }) => api("DELETE", `/api/admin/reviews/${review.id}`),

  deletePayment: async ({ payment }: { payment: { id: string } }) => api("DELETE", `/api/admin/payments/${payment.id}`),

  getNfcLink: async ({ tag, employee }: { tag?: { id: string }; employee?: { id: string } }) => {
    if (tag) {
      const r = await api("GET", `/api/admin/businesses/${tag.id}/nfc-tag`, undefined);
      return (r as { url: string }).url;
    }
    if (employee) {
      const r = await api("POST", `/api/employees/${employee.id}/nfc-tag`, {});
      return `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/nfc/${(r as { token: string }).token}`;
    }
    throw new Error("Falta tag o employee");
  },
};

/* ---------------- EMPLEADO ---------------- */
export const employeeHooks = {} as Record<string, (...args: unknown[]) => unknown>; // solo lectura

export const ownerHooksTyped = ownerHooks as unknown as Record<string, (...args: unknown[]) => unknown>;
export const adminHooksTyped = adminHooks as unknown as Record<string, (...args: unknown[]) => unknown>;
export const employeeHooksTyped = employeeHooks as Record<string, (...args: unknown[]) => unknown>;
