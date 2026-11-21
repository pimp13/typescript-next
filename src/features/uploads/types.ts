export type UploadFolder = "avatars" | "articles" | "general";

export type UploadResult = {
  url: string;
  path: string;
  filename: string;
  size: number;
  content_type: string;
  folder: string;
};
