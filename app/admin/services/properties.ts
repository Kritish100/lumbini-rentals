import { getApiKey } from "../actions";
import type { AdminProperty } from "../types";

const BASE_URL = "https://api.lumbinirentals.kritishbhattarai.com.np";

export type ResponseType = {
  data: AdminProperty[];
  success: boolean;
};

// Helper to keep error handling consistent across all calls
async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(
      body?.message || `Request failed with status ${res.status}`,
    );
  }
  return res.json();
}

// GET /api/properties/admin
export async function getAdminProperties(): Promise<ResponseType> {
  const apiKey = await getApiKey();
  const res = await fetch(`${BASE_URL}/api/properties/admin`, {
    headers: {
      "x-api-key": apiKey,
    },
    cache: "no-store",
  });
  return handleResponse<ResponseType>(res);
}

// POST /api/properties
export async function createProperty(
  data: Partial<AdminProperty>,
): Promise<AdminProperty> {
  const apiKey = await getApiKey();
  const res = await fetch(`${BASE_URL}/api/properties`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": apiKey },
    body: JSON.stringify(data),
  });

  return handleResponse<AdminProperty>(res);
}

export async function updateProperty(
  id: string,
  data: Partial<AdminProperty>,
): Promise<AdminProperty> {
  const apiKey = await getApiKey();
  const res = await fetch(`${BASE_URL}/api/properties/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "x-api-key": apiKey },
    body: JSON.stringify(data),
  });

  return handleResponse<AdminProperty>(res);
}

export async function uploadAssets(
  id: string,
  formData: FormData,
): Promise<AdminProperty> {
  const apiKey = await getApiKey();
  const res = await fetch(`${BASE_URL}/api/properties/assets/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": apiKey },
    body: formData,
  });

  return handleResponse<AdminProperty>(res);
}

export async function deleteProperties(ids: string[]) {
  const apiKey = await getApiKey();
  const res = await fetch(`${BASE_URL}/api/properties`, {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({
      ids,
    }),
  });

  return handleResponse<AdminProperty>(res);
}

//
export async function toggleArchive(id: string, value: boolean) {
  const apiKey = await getApiKey();
  const res = await fetch(`${BASE_URL}/api/properties/archive/${id}`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({
      isArchived: !!value,
    }),
  });
  return handleResponse<AdminProperty>(res);
}

// PUT /api/properties
export async function toggleNegotiable(id: string, value: boolean) {
  const apiKey = await getApiKey();
  const res = await fetch(`${BASE_URL}/api/properties/negotiable/${id}`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({
      isNegotiable: !!value,
    }),
  });
  return handleResponse<AdminProperty>(res);
}
