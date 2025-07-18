import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";

// Utilidades
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
  const selected = options.sort(() => 0.5 - Math.random()).slice(0, 2);
  return selected.join(", ");
};

// 🎯 Función principal
export function generateFiles(count: number, outputDir = "./output") {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  for (let i = 1; i <= count; i++) {
    const jsonData = {
      extractedText: `pagina ${i}`,
      confidence: getRandomConfidence(),
      observations: getRandomObservation(),
    };

    // Guardar JSON
    const jsonPath = path.join(outputDir, `documento_${i}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2), "utf-8");

    // Crear PDF usando el JSON
    const pdfPath = path.join(outputDir, `documento_${i}.pdf`);
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(pdfPath));

    doc.fontSize(18).text(`Documento ${i}`, { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Texto extraído: ${jsonData.extractedText}`);
    doc.text(`Confidence: ${jsonData.confidence}`);
    doc.text(`Observaciones: ${jsonData.observations}`);

    doc.end();

    console.log(`✅ Generado: ${pdfPath} y ${jsonPath}`);
  }
}

generateFiles(5);
