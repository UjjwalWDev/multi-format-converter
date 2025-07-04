// server.js
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const Tesseract = require("tesseract.js");
const pdfParse = require("pdf-parse");
// const pdf = require("pdf-poppler");
const { PDFDocument: LibPDFDocument } = require("pdf-lib");
const { PDFDocument: CustomPDFDocument ,rgb} = require("pdf-lib");
const { PDFDocument: OrganizePDFDocument } = require("pdf-lib");
const heicConvert = require("heic-convert");
// const { extract } = require("unrar-promise");
const archiver = require("archiver");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const FormData = require("form-data")
const router = express.Router();


// const { PDFDocument: MergePDFDocument } = require("pdf-lib");
const { execFile } = require("child_process");
const { exec } = require("child_process");
const xlsx = require("xlsx");
const { stringify } = require("csv-stringify/sync")
// const ffmpeg = require("fluent-ffmpeg")
const { v4: uuidv4 } = require("uuid")
const sharp = require("sharp")
// const libre = require('libreoffice-convert');
// const potrace = require("potrace");
const mammoth = require("mammoth");
const { Document, Packer, Paragraph, TextRun } = require("docx");
const XLSX = require("xlsx");
const pngToIco = require('png-to-ico');
const mime = require('mime-types');
require("dotenv").config();
const PDFLib = require("pdf-lib");
const CompressPDFDocument = PDFLib.PDFDocument;

// Dynamic port configuration
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';
const BASE_URL = process.env.BASE_URL || `http://${HOST}:${PORT}`;

const app = express();
const upload = multer({ dest: "uploads/" });
const memoryUpload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.static(path.join(__dirname, "uploads")));
app.use("/converted", express.static(path.join(__dirname, "converted")));
const convertedDir = path.join(__dirname, 'converted');

// Helper function to generate download URL
const generateDownloadUrl = (filename) => {
  return `${BASE_URL}/${filename}`;
};

const generateConvertedUrl = (filename) => {
  return `${BASE_URL}/converted/${filename}`;
};

// Image to PDF
app.post("/api/image-to-pdf", upload.array("images"), async (req, res) => {
  if (!req.files?.length) return res.status(400).send("No files uploaded.");
  const pdfPath = path.join(__dirname, "uploads", `converted-${Date.now()}.pdf`);
  const doc = new PDFDocument();
  const stream = fs.createWriteStream(pdfPath);
  doc.pipe(stream);

  try {
    for (const file of req.files) {
      doc.addPage();
      doc.image(file.path, { fit: [500, 700], align: "center", valign: "center" });
      fs.unlinkSync(file.path);
    }

    doc.end();
    stream.on("finish", () => {
      res.json({ 
        url: generateDownloadUrl(path.basename(pdfPath)), 
        name: path.basename(pdfPath) 
      });
    });
  } catch (error) {
    console.error("PDF conversion error:", error);
    res.status(500).send("Error while converting image to PDF");
  }
});

// Image to Text
app.post("/api/image-to-text", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).send("No image uploaded");

  try {
    const imagePath = req.file.path;

    // Perform OCR
    const {
      data: { text },
    } = await Tesseract.recognize(imagePath, "eng");

    // Delete the uploaded image after processing
    fs.unlinkSync(imagePath);

    // Ensure 'converted' directory exists
    const convertedDir = path.join(__dirname, "converted");
    if (!fs.existsSync(convertedDir)) {
      fs.mkdirSync(convertedDir, { recursive: true });
    }

    // Save text result to file
    const fileName = `text_${Date.now()}.txt`;
    const filePath = path.join(convertedDir, fileName);
    fs.writeFileSync(filePath, text);

    // Respond with download URL
    res.json({ downloadUrl: `/converted/${fileName}` });
  } catch (error) {
    console.error("OCR error:", error);
    res.status(500).json({ error: "Failed to extract text from image" });
  }
});

// PDF to HTML
app.post("/api/pdf-to-html", upload.single("pdf"), async (req, res) => {
  if (!req.file) return res.status(400).send("No PDF file uploaded");

  const filePath = path.join(__dirname, req.file.path);
  try {
    const data = await pdfParse(fs.readFileSync(filePath));
    const htmlContent = `<!DOCTYPE html><html><body><pre>${data.text}</pre></body></html>`;
    const htmlFilePath = path.join(__dirname, "converted", req.file.originalname.replace(/\.pdf$/, ".html"));
    if (!fs.existsSync("converted")) fs.mkdirSync("converted");
    fs.writeFileSync(htmlFilePath, htmlContent);
    fs.unlinkSync(filePath);
    res.json({ 
      url: generateConvertedUrl(path.basename(htmlFilePath)), 
      name: path.basename(htmlFilePath) 
    });
  } catch (error) {
    console.error("Conversion error:", error);
    res.status(500).json({ error: "Failed to convert PDF to HTML" });
  }
});

// PDF to JPG
app.post("/convert", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const filePath = req.file.path;
  const outputDir = path.join("converted", path.parse(req.file.filename).name);
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const options = { format: "jpeg", out_dir: outputDir, out_prefix: "page", page: null };
  try {
    await pdf.convert(filePath, options);
    const files = fs.readdirSync(outputDir).filter(f => f.endsWith(".jpg")).map(f => ({
      url: `/converted/${path.parse(req.file.filename).name}/${f}`, 
      name: f, 
      type: "JPG Image"
    }));
    fs.unlinkSync(filePath);
    res.json({ files });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to convert PDF" });
  }
});

// PDF to PNG


app.post("/convert-pdf-to-png", upload.single("file"), (req, res) => {
  const inputPath = req.file.path;
  const outputDir = path.join(__dirname, "converted");

  // Ensure output dir exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPrefix = path.join(outputDir, "page");

  const command = `pdftoppm -png "${inputPath}" "${outputPrefix}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error("Conversion error:", stderr);
      return res.status(500).json({ error: "Conversion failed" });
    }

    // Collect all generated PNGs
    const images = fs.readdirSync(outputDir)
      .filter(file => file.endsWith(".png"))
      .map(file => ({
        url: `/converted/${file}`,
        name: file
      }));

    res.json({ images });
  });
});

// PDF to TXT
app.post("/convert-pdf-to-txt", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No PDF uploaded");
    }

    // Extract text from PDF
    const data = await pdfParse(req.file.path);
    const extractedText = data.text;

    // Delete the uploaded PDF after processing
    fs.unlink(req.file.path, () => {});

    // Ensure 'converted' directory exists
    const convertedDir = path.join(__dirname, "converted");
    if (!fs.existsSync(convertedDir)) {
      fs.mkdirSync(convertedDir, { recursive: true });
    }

    // Save text result to file
    const fileName = `pdf_text_${Date.now()}.txt`;
    const filePath = path.join(convertedDir, fileName);
    fs.writeFileSync(filePath, extractedText);

    // Respond with download URL
    res.json({ downloadUrl: `/converted/${fileName}` });
  } catch (err) {
    console.error("Error extracting text from PDF:", err);
    res.status(500).json({ error: "Failed to extract text" });
  }
});

// PDF to DOCX (dummy copy method)
app.post("/convert-pdf-to-word", upload.single("file"), async (req, res) => {
  try {
    const originalPath = req.file.path;
    const outputFileName = path.parse(req.file.originalname).name + ".docx";
    const convertedPath = path.join("converted", outputFileName);
    fs.copyFileSync(originalPath, convertedPath);
    fs.unlinkSync(originalPath);
    
    res.json({ 
      url: `${BASE_URL}/converted/${outputFileName}`,
      name: outputFileName 
    });
  } catch (error) {
    console.error("Error in conversion:", error);
    res.status(500).json({ error: "Conversion failed" });
  }
});

// PDF Split Functionality
app.post("/split-pdf", upload.single("file"), async (req, res) => {
  try {
    const uploadedPath = req.file.path;
    const pdfBytes = fs.readFileSync(uploadedPath);
    const pdfDoc = await LibPDFDocument.load(pdfBytes);
    const totalPages = pdfDoc.getPageCount();
    const outputDir = path.join("converted", path.parse(req.file.originalname).name + "-split");

    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const splitUrls = [];

    for (let i = 0; i < totalPages; i++) {
      const newPdf = await LibPDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
      newPdf.addPage(copiedPage);
      const splitPdfBytes = await newPdf.save();
      const splitFileName = `page-${i + 1}.pdf`;
      const splitFilePath = path.join(outputDir, splitFileName);
      fs.writeFileSync(splitFilePath, splitPdfBytes);
      splitUrls.push({ 
        url: `/converted/${path.basename(outputDir)}/${splitFileName}`, 
        name: splitFileName 
      });
    }

    fs.unlinkSync(uploadedPath);
    res.json({ files: splitUrls });
  } catch (err) {
    console.error("PDF Split Error:", err);
    res.status(500).json({ error: "Failed to split PDF" });
  }
});


//csv to xls
app.post("/api/csv-to-xls", memoryUpload.array("csvFiles"), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No CSV files uploaded" });
    }

    const file = req.files[0];
    const csvData = file.buffer.toString("utf-8");
    const workbook = xlsx.read(csvData, { type: "string" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const newWorkbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(newWorkbook, worksheet, "Sheet1");

    const outputFilename = `${Date.now()}-${file.originalname.replace(/\.csv$/, "")}.xls`;
    const outputPath = path.join(convertedDir, outputFilename);
    xlsx.writeFile(newWorkbook, outputPath);

    return res.json({
      url: `${BASE_URL}/converted/${outputFilename}`,
      name: outputFilename,
    });
  } catch (error) {
    console.error("Conversion error:", error);
    return res.status(500).json({ error: "Conversion failed" });
  }
});

//xlsx to csv
app.post("/api/xlsx-to-csv", memoryUpload.array("xlsxFiles"), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No XLSX files uploaded" })
    }

    const file = req.files[0]
    const workbook = xlsx.read(file.buffer, { type: "buffer" })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 })
    const csvData = stringify(jsonData)

    const outputFilename = `${Date.now()}-${file.originalname.replace(/\.(xlsx|xls)$/, "")}.csv`
    const outputPath = path.join(convertedDir, outputFilename)
    fs.writeFileSync(outputPath, csvData)

    return res.json({
      url: `${BASE_URL}/converted/${outputFilename}`,
      name: outputFilename,
    })
  } catch (error) {
    console.error("Conversion error:", error)
    return res.status(500).json({ error: "Conversion failed" })
  }
})

app.post("/api/xls-to-csv", memoryUpload.array("xlsFiles"), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No XLS files uploaded" })
    }

    const file = req.files[0]
    // Read XLS file buffer using xlsx library (xlsx supports old XLS too)
    const workbook = xlsx.read(file.buffer, { type: "buffer" })

    // Take first sheet only
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]

    // Convert worksheet to JSON rows
    const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 })

    // Convert JSON rows to CSV string
    const csvData = stringify(jsonData)

    const outputFilename = `${Date.now()}-${file.originalname.replace(/\.xls$/, "")}.csv`
    const outputPath = path.join(convertedDir, outputFilename)

    // Write CSV string to file
    fs.writeFileSync(outputPath, csvData)

    return res.json({
      url: generateConvertedUrl(outputFilename),
      name: outputFilename,
    })
  } catch (error) {
    console.error("Conversion error:", error)
    return res.status(500).json({ error: "Conversion failed" })
  }
})

//video to audio
app.post("/api/video-to-audio", memoryUpload.array("videoFiles"), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No video files uploaded" })
    }

    const file = req.files[0]
    const inputPath = path.join(__dirname, "uploads", file.originalname)
    const outputFilename = `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, "")}.mp3`
    const outputPath = path.join(convertedDir, outputFilename)

    // Save the uploaded video temporarily
    fs.writeFileSync(inputPath, file.buffer)

    // Convert video to audio mp3 using ffmpeg
    ffmpeg(inputPath)
      .noVideo()
      .audioCodec("libmp3lame")
      .format("mp3")
      .on("end", () => {
        // Remove temp video file after conversion
        fs.unlinkSync(inputPath)

        return res.json({
          url: generateConvertedUrl(outputFilename),
          name: outputFilename,
        })
      })
      .on("error", (err) => {
        console.error("Conversion error:", err)
        fs.unlinkSync(inputPath) // Clean up on error
        return res.status(500).json({ error: "Conversion failed" })
      })
      .save(outputPath)

  } catch (error) {
    console.error("Conversion error:", error)
    return res.status(500).json({ error: "Conversion failed" })
  }
})

// AVIF to JPG
app.post("/api/avif-to-jpg", memoryUpload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" })
    const outputFilename = `${Date.now()}-converted.jpg`
    const outputPath = path.join(convertedDir, outputFilename)

    await sharp(req.file.buffer)
      .jpeg()
      .toFile(outputPath)

    res.json({ 
      url: generateConvertedUrl(outputFilename), 
      name: outputFilename 
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Conversion failed" })
  }
})

// AVIF to PNG
app.post("/api/avif-to-png", memoryUpload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" })
    const outputFilename = `${Date.now()}-converted.png`
    const outputPath = path.join(convertedDir, outputFilename)

    await sharp(req.file.buffer)
      .png()
      .toFile(outputPath)

    res.json({ 
      url: generateConvertedUrl(outputFilename), 
      name: outputFilename 
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Conversion failed" })
  }
})

// AVIF to WEBP
app.post("/api/avif-to-webp", memoryUpload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" })
    const outputFilename = `${Date.now()}-converted.webp`
    const outputPath = path.join(convertedDir, outputFilename)

    await sharp(req.file.buffer)
      .webp()
      .toFile(outputPath)

    res.json({ 
      url: generateConvertedUrl(outputFilename), 
      name: outputFilename 
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Conversion failed" })
  }
})

// WEBP to AVIF
app.post("/api/webp-to-avif", memoryUpload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" })
    const outputFilename = `${Date.now()}-converted.avif`
    const outputPath = path.join(convertedDir, outputFilename)

    await sharp(req.file.buffer)
      .avif()
      .toFile(outputPath)

    res.json({ 
      url: generateConvertedUrl(outputFilename), 
      name: outputFilename 
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Conversion failed" })
  }
})

// WEBP to JPG
app.post("/api/webp-to-jpg", memoryUpload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" })
    const outputFilename = `${Date.now()}-converted.jpg`
    const outputPath = path.join(convertedDir, outputFilename)

    await sharp(req.file.buffer)
      .jpeg()
      .toFile(outputPath)

    res.json({ 
      url: generateConvertedUrl(outputFilename), 
      name: outputFilename 
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Conversion failed" })
  }
})

// WEBP to PNG
app.post("/api/webp-to-png", memoryUpload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" })
    const outputFilename = `${Date.now()}-converted.png`
    const outputPath = path.join(convertedDir, outputFilename)

    await sharp(req.file.buffer)
      .png()
      .toFile(outputPath)

    res.json({ 
      url: generateConvertedUrl(outputFilename), 
      name: outputFilename 
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Conversion failed" })
  }
})

// WEBP to PDF
app.post("/api/webp-to-pdf", memoryUpload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" })

    // Convert webp buffer to png buffer to embed in PDF (sharp)
    const pngBuffer = await sharp(req.file.buffer).png().toBuffer()

    const outputFilename = `${Date.now()}-converted.pdf`
    const outputPath = path.join(convertedDir, outputFilename)

    const doc = new PDFDocument()
    const stream = fs.createWriteStream(outputPath)
    doc.pipe(stream)

    // Embed the image, fit to page width (A4 width ~595)
    doc.image(pngBuffer, {
      fit: [595, 842],
      align: "center",
      valign: "center",
    })

    doc.end()

    stream.on("finish", () => {
      res.json({ 
        url: generateConvertedUrl(outputFilename), 
        name: outputFilename 
      })
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Conversion failed" })
  }
})

// PNG to AVIF
app.post("/api/png-to-avif", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("File mimetype:", req.file.mimetype);
    console.log("File size:", req.file.size);

    if (req.file.mimetype !== "image/png") {
      return res.status(400).json({ error: "Uploaded file is not a PNG image" });
    }

    const outputFilename = `${Date.now()}-converted.avif`;
    const outputPath = path.join(convertedDir, outputFilename);

    // Pass the file path to sharp
    await sharp(req.file.path).avif().toFile(outputPath);

    res.json({
      url: generateConvertedUrl(outputFilename),
      name: outputFilename,
    });
  } catch (error) {
    console.error("Conversion error:", error);
    res.status(500).json({ error: "Conversion failed" });
  }
});

// JPG to AVIF
app.post("/api/jpg-to-avif", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("File mimetype:", req.file.mimetype);
    console.log("File size:", req.file.size);

    if (!["image/jpeg", "image/jpg"].includes(req.file.mimetype)) {
      return res.status(400).json({ error: "Uploaded file is not a JPG/JPEG image" });
    }

    const outputFilename = `${Date.now()}-converted.avif`;
    const outputPath = path.join(convertedDir, outputFilename);

    // Convert JPG/JPEG file to AVIF using sharp reading from file path
    await sharp(req.file.path)
      .avif()
      .toFile(outputPath);

    res.json({
      url: generateConvertedUrl(outputFilename),
      name: outputFilename,
    });
  } catch (error) {
    console.error("Conversion error:", error);
    res.status(500).json({ error: "Conversion failed" });
  }
});

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

// PDF → PPTX
app.post("/api/pdf-to-ppt", upload.single("file"), (req, res) => {
  const inputPath = req.file.path;
  const outputDir = path.join(__dirname, "converted");
  const outputFileName = path.parse(req.file.originalname).name;

  ensureDir(outputDir);

  exec(`soffice --headless --convert-to pptx "${inputPath}" --outdir "${outputDir}"`, (error) => {
    if (error) {
      console.error("Conversion error (PDF to PPT):", error);
      return res.status(500).json({ error: "Conversion failed" });
    }

    const outputFile = `${outputFileName}.pptx`;
    res.json({
      url: `/converted/${outputFile}`,
      name: outputFile,
    });
  });
});

// PPTX → PDF
app.post("/api/ppt-to-pdf", upload.single("file"), (req, res) => {
  const inputPath = req.file.path;
  const outputDir = path.join(__dirname, "converted");
  const outputFileName = path.parse(req.file.originalname).name;

  ensureDir(outputDir);

  exec(`soffice --headless --convert-to pdf "${inputPath}" --outdir "${outputDir}"`, (error) => {
    if (error) {
      console.error("Conversion error (PPT to PDF):", error);
      return res.status(500).json({ error: "Conversion failed" });
    }

    const outputFile = `${outputFileName}.pdf`;
    res.json({
      url: `/converted/${outputFile}`,
      name: outputFile,
    });
  });
});

const outputDir = path.join(__dirname, "converted");

// Route to convert SVG to PNG
app.post("/api/svg-to-png", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileName = path.basename(filePath, path.extname(filePath));
    const outputFileName = `${fileName}.png`;
    const outputPath = path.join(outputDir, outputFileName);

    // Convert SVG to PNG
    await sharp(filePath)
      .resize(1024) // optional resizing
      .png()
      .toFile(outputPath);

    // Serve the file via URL
    const fileUrl = generateConvertedUrl(outputFileName);

    res.json({
      url: fileUrl,
      name: outputFileName,
    });
  } catch (error) {
    console.error("Conversion error:", error);
    res.status(500).json({ error: "Failed to convert SVG to PNG." });
  }
});

const uploadDir = path.join(__dirname, "uploads");


// Endpoint for Word to Text
app.post("/api/word-to-text", upload.single("wordFile"), async (req, res) => {
  const filePath = req.file.path;

  try {
    const result = await mammoth.extractRawText({ path: filePath });
    const text = result.value; // Extracted plain text
    fs.unlinkSync(filePath); // Optional: clean up file after processing
    res.json({ text });
  } catch (err) {
    console.error("Mammoth error:", err);
    res.status(500).json({ error: "Failed to extract text from Word document." });
  }
});


app.post("/api/text-to-word", upload.single("textFile"), async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: "Text file missing or upload failed." });
    }

    const filePath = req.file.path;
    const textContent = fs.readFileSync(filePath, "utf-8").trim() || " ";

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [new Paragraph({ children: [new TextRun(textContent)] })],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);

    // Clean up temp file
    fs.unlinkSync(filePath);

    // Headers
    res.setHeader("Content-Disposition", "attachment; filename=converted.docx");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    res.setHeader("Content-Length", buffer.length);

    res.end(buffer); // More reliable for binary
  } catch (err) {
    console.error("Error during text to Word conversion:", err);
    res.status(500).json({ error: "Internal server error during conversion" });
  }
});
// POST /api/text-to-pdf

app.post("/api/txt-to-pdf", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" })
  }

  const txtPath = req.file.path

  // Read TXT file content
  fs.readFile(txtPath, "utf8", (err, data) => {
    if (err) {
      console.error("File read error:", err)
      return res.status(500).json({ error: "Failed to read file" })
    }

    // Create a PDF document in memory
    const doc = new PDFDocument()
    let buffers = []

    doc.on("data", buffers.push.bind(buffers))
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers)

      // Cleanup uploaded txt file
      fs.unlink(txtPath, (unlinkErr) => {
        if (unlinkErr) console.error("Failed to delete temp txt file:", unlinkErr)
      })

      // Set headers and send PDF file buffer
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${req.file.originalname.replace(/\.txt$/i, ".pdf")}"`,
        "Content-Length": pdfData.length,
      })
      res.send(pdfData)
    })

    // Add the TXT content to PDF
    doc.font("Times-Roman").fontSize(12).text(data)
    doc.end()
  })
})

app.post("/convert-rtf-to-pdf", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" })
  }

  const inputPath = req.file.path
  const outputDir = path.resolve("converted")
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir)

  const command = `soffice --headless --convert-to pdf --outdir "${outputDir}" "${inputPath}"`

  console.log("Running command:", command)

  exec(command, (error, stdout, stderr) => {
    console.log("STDOUT:", stdout)
    console.log("STDERR:", stderr)

    fs.unlink(inputPath, (unlinkErr) => {
      if (unlinkErr) console.error("Failed to delete uploaded file:", unlinkErr)
    })

    if (error) {
      console.error("Conversion error:", error)
      return res.status(500).json({ error: "Conversion failed", details: error.message })
    }

    // Use multer filename (without extension) for output pdf filename
    const pdfFilename = req.file.filename + ".pdf"
    const pdfFilePath = path.join(outputDir, pdfFilename)

    if (!fs.existsSync(pdfFilePath)) {
      console.error("PDF file not found after conversion")
      return res.status(500).json({ error: "PDF file not found after conversion" })
    }

    res.json({
      results: [
        {
          url: `/converted/${pdfFilename}`,
          name: pdfFilename,
          type: "application/pdf",
        },
      ],
    })
  })
})

app.post('/convert-png-to-ico', upload.single('file'), async (req, res) => {
  try {
    const inputPath = req.file.path;
    const outputPath = path.join('converted', `${req.file.filename}.ico`);

    // png-to-ico expects input file(s) as buffer(s)
    const icoBuffer = await pngToIco(inputPath);

    // Save ICO buffer to output file
    fs.writeFileSync(outputPath, icoBuffer);

    // Respond with URL(s) to the converted file(s)
    res.json({
      results: [
        {
          url: `${BASE_URL}/converted/${outputName}`,
          name: `${req.file.originalname.replace(/\.png$/, '')}.ico`,
          type: 'image/x-icon',
        },
      ],
    });
  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({ error: 'Conversion failed' });
  }
});

// const mime = require('mime-types');

app.post("/convert-bmp-to-jpg", upload.single("image"), async (req, res) => {
  const inputPath = req.file.path;
  const ext = mime.lookup(inputPath);

  if (ext !== 'image/bmp') {
    return res.status(400).json({ error: "Unsupported format: not a BMP image." });
  }

  const outputPath = inputPath.replace(".bmp", ".jpg");
  try {
    await sharp(inputPath).jpeg().toFile(outputPath);
    res.download(outputPath, "converted.jpg", () => {
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    });
  } catch (error) {
    console.error("BMP to JPG conversion error:", error);
    res.status(500).json({ error: "Conversion failed" });
  }
});


// GIF to MP4 conversion endpoint
app.post("/api/gif-to-mp4", upload.single("image"), (req, res) => {
  const inputPath = req.file.path
  const outputName = `${uuidv4()}.mp4`
  const outputPath = path.join("converted", outputName)

  ffmpeg(inputPath)
    .outputOptions("-movflags", "faststart") // Optional optimization
    .toFormat("mp4")
    .on("end", () => {
      fs.unlinkSync(inputPath) // Cleanup uploaded GIF
      res.json({
        url: `${BASE_URL}/converted/${outputName}`,
        name: outputName,
      })
    })
    .on("error", (err) => {
      console.error("Conversion error:", err)
      res.status(500).json({ error: "Conversion failed" })
    })
    .save(outputPath)
})

app.post("/api/mp4-to-gif", upload.single("video"), (req, res) => {
  const inputPath = req.file.path
  const outputName = `${uuidv4()}.gif`
  const outputPath = path.join("converted", outputName)

  ffmpeg(inputPath)
    .outputOptions([
      "-vf", "fps=10,scale=320:-1:flags=lanczos", // adjust fps/size here
      "-loop", "0"
    ])
    .toFormat("gif")
    .on("end", () => {
      fs.unlinkSync(inputPath)
      res.json({
        url: `${BASE_URL}/converted/${outputName}`,
        name: outputName,
      })
    })
    .on("error", (err) => {
      console.error("Conversion error:", err)
      res.status(500).json({ error: "Conversion failed" })
    })
    .save(outputPath)
})

app.post("/api/mp3-to-wav", upload.single("audio"), (req, res) => {
  const inputPath = req.file.path
  const outputName = `${uuidv4()}.wav`
  const outputPath = path.join("converted", outputName)

  ffmpeg(inputPath)
    .toFormat("wav")
    .on("end", () => {
      fs.unlinkSync(inputPath)
      res.json({
        url: `${BASE_URL}/converted/${outputName}`,
        name: outputName,
      })
    })
    .on("error", (err) => {
      console.error("Conversion error:", err)
      res.status(500).json({ error: "Conversion failed" })
    })
    .save(outputPath)
})


// WAV to MP3 route
app.post("/api/wav-to-mp3", upload.single("audio"), (req, res) => {
  const inputPath = req.file.path
  const outputName = `${uuidv4()}.mp3`
  const outputPath = path.join("converted", outputName)

  ffmpeg(inputPath)
    .toFormat("mp3")
    .on("end", () => {
      fs.unlinkSync(inputPath)
      res.json({
        url: `${BASE_URL}/converted/${outputName}`,
        name: outputName,
      })
    })
    .on("error", (err) => {
      console.error("Conversion error:", err)
      res.status(500).json({ error: "Conversion failed" })
    })
    .save(outputPath)
})


app.post("/api/flac-to-mp3", upload.single("audio"), (req, res) => {
  const inputPath = req.file.path
  const outputName = `${uuidv4()}.mp3`
  const outputPath = path.join("converted", outputName)

  ffmpeg(inputPath)
    .toFormat("mp3")
    .on("end", () => {
      fs.unlinkSync(inputPath)
      res.json({
        url: `${BASE_URL}/converted/${outputName}`,
        name: outputName,
      })
    })
    .on("error", (err) => {
      console.error("Conversion error:", err)
      res.status(500).json({ error: "Conversion failed" })
    })
    .save(outputPath)
})


app.post("/api/mkv-to-mp4", upload.single("video"), (req, res) => {
  const inputPath = req.file.path
  const outputName = `${uuidv4()}.mp4`
  const outputPath = path.join("converted", outputName)

  ffmpeg(inputPath)
    .toFormat("mp4")
    .on("end", () => {
      fs.unlinkSync(inputPath)
      res.json({
        url: `${BASE_URL}/converted/${outputName}`,
        name: outputName,
      })
    })
    .on("error", (err) => {
      console.error("MKV to MP4 conversion error:", err)
      res.status(500).json({ error: "Conversion failed" })
    })
    .save(outputPath)
})


app.post("/api/mp4-to-mov", upload.single("video"), (req, res) => {
  const inputPath = req.file.path
  const outputName = `${uuidv4()}.mov`
  const outputPath = path.join("converted", outputName)

  ffmpeg(inputPath)
    .toFormat("mov")
    .on("end", () => {
      fs.unlinkSync(inputPath)
      res.json({
        url: `${BASE_URL}/converted/${outputName}`,
        name: outputName,
      })
    })
    .on("error", (err) => {
      console.error("MP4 to MOV conversion error:", err)
      res.status(500).json({ error: "Conversion failed" })
    })
    .save(outputPath)
})

app.post("/api/mov-to-mp4", upload.single("video"), (req, res) => {
  const inputPath = req.file.path
  const outputName = `${uuidv4()}.mp4`
  const outputPath = path.join("converted", outputName)

  ffmpeg(inputPath)
    .toFormat("mp4")
    .on("end", () => {
      fs.unlinkSync(inputPath)
      res.json({
        url: `${BASE_URL}/converted/${outputName}`,
        name: outputName,
      })
    })
    .on("error", (err) => {
      console.error("MOV to MP4 conversion error:", err)
      res.status(500).json({ error: "Conversion failed" })
    })
    .save(outputPath)
})

// app.post("/api/epub-to-pdf", upload.single("epub"), (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: "No file uploaded" });
//   }

//   const originalExtension = path.extname(req.file.originalname); // e.g., .epub
//   const tempPath = req.file.path; // original multer path (without extension)
//   const renamedInputPath = `${tempPath}${originalExtension}`; // append correct extension

//   // Rename temp file to have the correct extension
//   fs.rename(tempPath, renamedInputPath, (renameErr) => {
//     if (renameErr) {
//       console.error("File rename error:", renameErr);
//       return res.status(500).json({ error: "Internal server error" });
//     }

//     const outputName = `${uuidv4()}.pdf`;
//     const outputPath = path.join("converted", outputName);

//     const command = `ebook-convert "${renamedInputPath}" "${outputPath}"`;

//     exec(command, (err, stdout, stderr) => {
//       if (err) {
//         console.error("Conversion error:", stderr);
//         return res.status(500).json({ error: "Conversion failed" });
//       }

//       fs.unlinkSync(renamedInputPath); // Clean up the renamed EPUB file

//       res.json({
//         url: `${BASE_URL}/converted/${outputName}`,
//         name: outputName,
//       });
//     });
//   });
// });


// app.post("/api/mobi-to-pdf", upload.single("mobi"), (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: "No file uploaded" });
//   }

//   const originalExtension = path.extname(req.file.originalname); // should be .mobi
//   const tempPath = req.file.path;
//   const renamedInputPath = `${tempPath}${originalExtension}`;

//   fs.rename(tempPath, renamedInputPath, (renameErr) => {
//     if (renameErr) {
//       console.error("File rename error:", renameErr);
//       return res.status(500).json({ error: "Internal server error" });
//     }

//     const outputName = `${uuidv4()}.pdf`;
//     const outputPath = path.join("converted", outputName);

//     const command = `ebook-convert "${renamedInputPath}" "${outputPath}"`;

//     exec(command, (err, stdout, stderr) => {
//       if (err) {
//         console.error("Conversion error:", stderr);
//         return res.status(500).json({ error: "Conversion failed" });
//       }

//       fs.unlinkSync(renamedInputPath); // Cleanup the renamed .mobi file

//       res.json({
//         url: `${BASE_URL}/converted/${outputName}`,
//         name: outputName,
//       });
//     });
//   });
// });


// app.post("/api/epub-to-mobi", upload.single("epub"), (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: "No file uploaded" });
//   }

//   const originalExtension = path.extname(req.file.originalname); // e.g., .epub or .eupb
//   const tempPath = req.file.path;
//   const renamedInputPath = `${tempPath}${originalExtension}`;

//   fs.rename(tempPath, renamedInputPath, (renameErr) => {
//     if (renameErr) {
//       console.error("File rename error:", renameErr);
//       return res.status(500).json({ error: "Internal server error" });
//     }

//     const outputName = `${uuidv4()}.mobi`;
//     const outputPath = path.join("converted", outputName);

//     const command = `ebook-convert "${renamedInputPath}" "${outputPath}"`;

//     exec(command, (err, stdout, stderr) => {
//       if (err) {
//         console.error("Conversion error:", stderr);
//         return res.status(500).json({ error: "Conversion failed" });
//       }

//       fs.unlinkSync(renamedInputPath);

//       res.json({
//         url: `${BASE_URL}/converted/${outputName}`,
//         name: outputName,
//       });
//     });
//   });
// });

app.post("/api/tiff-to-jpg", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" })

  const inputPath = req.file.path
  const outputName = `${uuidv4()}.jpg`
  const outputPath = path.join("converted", outputName)

  try {
    await sharp(inputPath)
      .jpeg({ quality: 90 })
      .toFile(outputPath)

    fs.unlinkSync(inputPath) // delete uploaded file

    res.json({
      url: `${BASE_URL}/converted/${outputName}`,
      name: outputName,
    })
  } catch (error) {
    console.error("Conversion error:", error)
    res.status(500).json({ error: "Conversion failed" })
  }
})

app.post("/api/tiff-to-png", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" })

  const inputPath = req.file.path
  const outputName = `${uuidv4()}.png`
  const outputPath = path.join("converted", outputName)

  try {
    await sharp(inputPath)
      .png({ compressionLevel: 9 })
      .toFile(outputPath)

    fs.unlinkSync(inputPath) // delete uploaded file

    res.json({
      url: `${BASE_URL}/converted/${outputName}`,
      name: outputName,
    })
  } catch (error) {
    console.error("Conversion error:", error)
    res.status(500).json({ error: "Conversion failed" })
  }
})

app.post("/api/compress-pdf", upload.single("pdfFile"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const buffer = fs.readFileSync(filePath);

    const pdfDoc = await CompressPDFDocument.load(buffer); // ✅ Use alias here
    const compressedPdf = await CompressPDFDocument.create(); // ✅ Use alias here
    const copiedPages = await compressedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());

    copiedPages.forEach((page) => compressedPdf.addPage(page));

    const compressedBuffer = await compressedPdf.save({ useObjectStreams: true });

    fs.unlinkSync(filePath); // ✅ Delete temp file

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=compressed.pdf");
    res.send(Buffer.from(compressedBuffer));
  } catch (error) {
    console.error("Compression error:", error);
    res.status(500).json({ error: "Failed to compress PDF" });
  }
});



// Unique route for Edit PDF
app.post("/api/edit-pdf", upload.single("pdfFile"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const pdfBytes = fs.readFileSync(filePath);
    const pdfDoc = await CustomPDFDocument.load(pdfBytes);

    const { addPage, removePage, insertText } = req.body;

    // Add a blank page if requested
    if (addPage === 'true') {
      pdfDoc.addPage();
    }

    // Remove a page (zero-based index)
    if (removePage !== undefined && !isNaN(removePage)) {
      const pageIndex = parseInt(removePage);
      if (pageIndex >= 0 && pageIndex < pdfDoc.getPageCount()) {
        pdfDoc.removePage(pageIndex);
      }
    }

    // Insert text into the first page (basic example)
    if (insertText) {
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      firstPage.drawText(insertText, {
        x: 50,
        y: 750,
        size: 12,
        color: rgb(0, 0, 0),
      });
    }

    const modifiedPdfBytes = await pdfDoc.save();
    const outputPath = `uploads/edited-${req.file.filename}`;
    fs.writeFileSync(outputPath, modifiedPdfBytes);

    res.download(outputPath, "edited.pdf", () => {
      fs.unlinkSync(filePath);
      fs.unlinkSync(outputPath);
    });
  } catch (error) {
    console.error("PDF edit error:", error);
    res.status(500).json({ error: "Failed to edit PDF" });
  }
});


app.post("/api/organize-pdf", upload.single("pdfFile"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileBuffer = fs.readFileSync(filePath);
    const pdfDoc = await OrganizePDFDocument.load(fileBuffer);
    const totalPages = pdfDoc.getPageCount();

    // Parse page order
    const pageOrder = req.body.pageOrder
      ? req.body.pageOrder.split(",").map((x) => parseInt(x.trim()))
      : Array.from({ length: totalPages }, (_, i) => i);

    // Parse keepPages
    const keepPages = req.body.keepPages
      ? req.body.keepPages.split(",").map((x) => parseInt(x.trim()))
      : null;

    // Parse rotation
    const rotateMap = req.body.rotatePages ? JSON.parse(req.body.rotatePages) : {};

    // Create new organized document
    const newDoc = await OrganizePDFDocument.create();

    for (let index of pageOrder) {
      if (index >= totalPages || index < 0) continue;
      if (keepPages && !keepPages.includes(index)) continue;

      const [copiedPage] = await newDoc.copyPages(pdfDoc, [index]);

      if (rotateMap.hasOwnProperty(index)) {
        copiedPage.setRotation(degrees(parseInt(rotateMap[index])));
      }

      newDoc.addPage(copiedPage);
    }

    const newPdfBytes = await newDoc.save();
    res.setHeader("Content-Disposition", 'attachment; filename="organized.pdf"');
    res.setHeader("Content-Type", "application/pdf");
    res.send(Buffer.from(newPdfBytes));

    fs.unlinkSync(filePath); // Delete temp file
  } catch (error) {
    console.error("PDF organization error:", error);
    res.status(500).json({ error: "PDF organization failed." });
  }
});

// Helper function
function degrees(angle) {
  return { angle };
}


// Compress image route
app.post("/api/compress-image", upload.single("image"), async (req, res) => {
  try {
    const inputPath = req.file.path;
    const outputPath = `uploads/compressed-${Date.now()}.jpg`;

    await sharp(inputPath)
      .jpeg({ quality: 60 }) // You can adjust quality (0–100)
      .toFile(outputPath);

    const compressedImage = fs.readFileSync(outputPath);

    // Cleanup
    fs.unlinkSync(inputPath);
    fs.unlinkSync(outputPath);

    res.set("Content-Type", "image/jpeg");
    res.send(compressedImage);
  } catch (error) {
    console.error("Compression Error:", error);
    res.status(500).json({ error: "Image compression failed." });
  }
});

app.post("/api/upscale-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send("No file uploaded");

    const inputPath = req.file.path;
    const upscaledBuffer = await sharp(inputPath)
      .resize({ width: 1000 }) // example upscale
      .toBuffer();

    res.set("Content-Type", "image/png");
    res.send(upscaledBuffer);
  } catch (err) {
    console.error("🔥 Upscaling Error:", err);
    res.status(500).send("Upscaling failed");
  }
});

app.post("/api/heic-to-jpg", upload.single("heicFile"), async (req, res) => {
  try {
    const heicPath = req.file.path;

    const inputBuffer = fs.readFileSync(heicPath);

    const outputBuffer = await heicConvert({
      buffer: inputBuffer,
      format: "JPEG",
      quality: 1,
    });

    // Send as response
    res.setHeader("Content-Type", "image/jpeg");
    res.send(outputBuffer);

    // Clean up
    fs.unlinkSync(heicPath);
  } catch (error) {
    console.error("HEIC to JPG conversion error:", error);
    res.status(500).json({ error: "Failed to convert HEIC to JPG" });
  }
});

app.post("/api/heic-to-png", upload.single("heicFile"), async (req, res) => {
  try {
    const heicPath = req.file.path;

    const inputBuffer = fs.readFileSync(heicPath);

    const outputBuffer = await heicConvert({
      buffer: inputBuffer,
      format: "PNG", // <-- PNG instead of JPEG
      quality: 1,
    });

    res.setHeader("Content-Type", "image/png");
    res.send(outputBuffer);

    fs.unlinkSync(heicPath); // cleanup
  } catch (error) {
    console.error("HEIC to PNG conversion error:", error);
    res.status(500).json({ error: "Failed to convert HEIC to PNG" });
  }
});

app.get("/api/status", (req, res) => {
  res.json({ status: "JSON Formatter API running" });
});

// Optional: if you want to accept JSON from frontend and log/validate it
app.post("/api/validate-json", (req, res) => {
  try {
    const parsed = JSON.parse(JSON.stringify(req.body));
    res.json({
      success: true,
      formatted: JSON.stringify(parsed, null, 2),
    });
  } catch (err) {
    res.status(400).json({ success: false, error: "Invalid JSON format" });
  }
});app.get("/api/status", (req, res) => {
  res.json({ status: "JSON Formatter API running" });
});

// Optional: if you want to accept JSON from frontend and log/validate it
app.post("/api/validate-json", (req, res) => {
  try {
    const parsed = JSON.parse(JSON.stringify(req.body));
    res.json({
      success: true,
      formatted: JSON.stringify(parsed, null, 2),
    });
  } catch (err) {
    res.status(400).json({ success: false, error: "Invalid JSON format" });
  }
});

router.post("/convert-rar-to-zip", upload.single("file"), async (req, res) => {
  try {
    const rarPath = req.file.path;
    const extractPath = path.join(__dirname, "extracted", path.parse(rarPath).name);

    // Create extract dir
    fs.mkdirSync(extractPath, { recursive: true });

    // Extract RAR contents
    await extract(rarPath, extractPath);

    // Zip extracted files
    const zipFilename = `${req.file.filename}.zip`;
    const zipPath = path.join(__dirname, "outputs", zipFilename);
    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => {
      res.download(zipPath, "converted.zip", () => {
        fs.unlinkSync(rarPath);
        fs.rmSync(extractPath, { recursive: true, force: true });
        fs.unlinkSync(zipPath);
      });
    });

    archive.pipe(output);
    archive.directory(extractPath, false);
    archive.finalize();
  } catch (err) {
    console.error("RAR to ZIP conversion error:", err);
    res.status(500).json({ error: "Conversion failed" });
  }
});

module.exports = router;
app.use(express.json({ limit: "10mb" }))
app.post("/api/json-to-excel", (req, res) => {
  try {
    const jsonData = req.body.jsonData

    let parsed
    try {
      parsed = typeof jsonData === "string" ? JSON.parse(jsonData) : jsonData
    } catch (err) {
      return res.status(400).send("Invalid JSON format")
    }

    if (!Array.isArray(parsed)) {
      return res.status(400).send("Expected JSON array of objects")
    }

    const worksheet = XLSX.utils.json_to_sheet(parsed)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")

    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" })

    res.setHeader("Content-Disposition", "attachment; filename=converted.xlsx")
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    res.send(buffer)
  } catch (err) {
    console.error("Conversion error:", err)
    res.status(500).send("Server error")
  }
})






app.listen(PORT, () => {
  console.log(`🚀 Express server running at http://localhost:${PORT}`);
});
