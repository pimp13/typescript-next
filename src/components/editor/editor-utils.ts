import type { Editor } from "@tiptap/react";

/** Turn plain text into a minimal HTML paragraph TipTap can load. */
export function normalizeEditorValue(value?: string | null): string {
  const raw = (value ?? "").trim();
  if (!raw) return "";
  if (/<[a-z][\s\S]*>/i.test(raw)) return raw;
  return `<p>${escapeHtml(raw)}</p>`;
}

/** Persist empty docs as "" instead of `<p></p>`. */
export function toEditorHtml(editor: Editor): string {
  if (editor.isEmpty) return "";
  return editor.getHTML();
}

export function getEditorPlainText(html: string): string {
  if (typeof document === "undefined") {
    return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  }
  const node = document.createElement("div");
  node.innerHTML = html;
  return (node.textContent ?? "").replace(/\s+/g, " ").trim();
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
