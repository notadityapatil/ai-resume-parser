import * as pdfjsLib from "pdfjs-dist";

let isInitialized = false;

async function initializePdfJs() {
  if (isInitialized) return;
  const pdfjs = await import("pdfjs-dist/build/pdf");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
  isInitialized = true;
}

export async function extractTextFromPdf(file: File): Promise<string> {
  await initializePdfJs();
  
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      fullText += textContent.items
        .map((item) => ("str" in item ? item.str : ""))
        .join(" ") + "\n";
    }

    return fullText;
  } catch (error) {
    throw new Error("Failed to extract text from PDF");
  }
}