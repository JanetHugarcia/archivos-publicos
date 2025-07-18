import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";

// Utilidades de datos aleatorios
const getRandomConfidence = (): number => {
  const options = [70, 80, 90, 100];
  return options[Math.floor(Math.random() * options.length)];
};

const getRandomObservation = (): string => {
  const options = [
    "observacion 1",
    "observacion importante",
    "nota adicional",
    "comentario extra",
    "observación secundaria",
  ];
  return options
    .sort(() => 0.5 - Math.random())
    .slice(0, 2)
    .join(", ");
};

interface PageData {
  extractedText: string;
  confidence: number;
  observations: string;
}

// 🎯 Función principal
export function generateJsonAndPdfFiles(count: number, outputDir = "./output") {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const allData: PageData[] = [];

  // Paso 1: Generar archivos JSON
  for (let i = 1; i <= count; i++) {
    const data: PageData = {
      extractedText: `pagina ${i}`,
      confidence: getRandomConfidence(),
      observations: getRandomObservation(),
    };

    const jsonPath = path.join(outputDir, `documento_${i}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), "utf-8");
    allData.push(data);
  }

  // Paso 2: Generar PDFs individuales
  allData.forEach((data, index) => {
    const doc = new PDFDocument();
    const pdfPath = path.join(outputDir, `documento_${index + 1}.pdf`);
    doc.pipe(fs.createWriteStream(pdfPath));

    doc.fontSize(18).text(`Documento ${index + 1}`, { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Texto extraído: ${data.extractedText}`);
    doc.text(`Confidence: ${data.confidence}`);
    doc.text(`Observaciones: ${data.observations}`);
    doc.end();
  });

  // Paso 3: Generar PDF único con todas las páginas
  const combinedPdf = new PDFDocument();
  const combinedPath = path.join(outputDir, "documento_unico.pdf");
  combinedPdf.pipe(fs.createWriteStream(combinedPath));

  allData.forEach((data, index) => {
    if (index > 0) combinedPdf.addPage();

    combinedPdf
      .fontSize(18)
      .text(`Documento ${index + 1}`, { align: "center" });
    combinedPdf.moveDown();
    combinedPdf.fontSize(12).text(`Texto extraído: ${data.extractedText}`);
    combinedPdf.text(`Confidence: ${data.confidence}`);
    combinedPdf.text(`Observaciones: ${data.observations}`);
  });

  combinedPdf.end();

  console.log(`✅ Archivos generados en: ${path.resolve(outputDir)}`);
  console.log(`📄 PDFs individuales + JSONs + documento_unico.pdf`);
}

generateJsonAndPdfFiles(5);
