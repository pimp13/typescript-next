import { goApiFetch } from "@/lib/api";
import type { UploadFolder, UploadResult } from "@/features/uploads/types";

export async function uploadFile(
  file: File,
  folder: UploadFolder = "general",
) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  return goApiFetch<UploadResult>("/uploads", {
    method: "POST",
    body: formData,
  });
}
