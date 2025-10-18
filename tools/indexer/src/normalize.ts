const CONTROL_EXCEPT_NEWLINE = /[\u0000-\u0009\u000B-\u001F\u007F]/g;

/** Normalize whitespace and control characters emitted by Tika. */
export function normalizeText(input: string): string {
  let text = input.replace(/\r\n?/g, "\n");
  text = text.replace(CONTROL_EXCEPT_NEWLINE, "");
  text = text.replace(/\t/g, " ");
  text = text
    .split("\n")
    .map((line) => line.replace(/[ \u00A0]+$/g, "")) // strip trailing spaces and NBSP
    .join("\n");
  text = text.replace(/\n{3,}/g, "\n\n");
  return text.trim();
}
