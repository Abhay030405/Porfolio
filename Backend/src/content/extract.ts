import mammoth from "mammoth";
import { extractText, getDocumentProxy } from "unpdf";

// Plain text out of an uploaded source document. The AI only ever sees this
// text, so formatting is dropped on purpose.

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
/** Enough for a long project write-up; beyond this the prompt gets expensive for little gain. */
export const MAX_TEXT_CHARS = 60_000;

const TEXT_TYPES = [".md", ".markdown", ".txt"];

export async function extractDocumentText(filename: string, mime: string, bytes: Uint8Array): Promise<string> {
  const name = filename.toLowerCase();
  let text: string;

  if (mime === "application/pdf" || name.endsWith(".pdf")) {
    const pdf = await getDocumentProxy(bytes);
    text = (await extractText(pdf, { mergePages: true })).text;
  } else if (name.endsWith(".docx")) {
    text = (await mammoth.extractRawText({ buffer: Buffer.from(bytes) })).value;
  } else if (mime.startsWith("text/") || TEXT_TYPES.some((ext) => name.endsWith(ext))) {
    text = new TextDecoder().decode(bytes);
  } else {
    throw new UnsupportedDocumentError(filename);
  }

  return text.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim().slice(0, MAX_TEXT_CHARS);
}

export class UnsupportedDocumentError extends Error {
  constructor(filename: string) {
    super(`Unsupported file type: ${filename}. Upload a PDF, DOCX, Markdown or text file.`);
  }
}
