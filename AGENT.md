# 📄 AGENT.md

## Project: AllEdit

---

## 📌 1. Overview

This project is a web-based application that provides utilities for:

- PDF operations (Merge, Compress, Convert)
- Image operations (Compress, Resize, Convert)
- PDF ↔ Image conversion
- File comparison (PDF & Image)

### Tech Stack

- Frontend: React + Tailwind CSS
- Backend: .NET Core Web API
- File Processing:
  - PDF: iText7 / PdfSharp
  - Image: ImageSharp

---

## 🎯 2. Goals

- Build a fast and responsive tool
- Maintain clean and minimal UI
- Ensure modular and scalable architecture
- Provide accurate file processing

---

## 🧭 3. System Architecture

Client (React) → API (.NET Core) → Processing Services → Response (File/URL)

---

# 🎨 4. FRONTEND (React)

## 📁 Folder Structure

/src
├── components
│ ├── FileUpload.jsx
│ ├── Loader.jsx
│ ├── Navbar.jsx
│ ├── ToolCard.jsx
│
├── pages
│ ├── Home.jsx
│ ├── pdf
│ │ ├── MergePdf.jsx
│ │ ├── CompressPdf.jsx
│ │ ├── ImageToPdf.jsx
│ │ ├── PdfToImage.jsx
│ │
│ ├── image
│ │ ├── CompressImage.jsx
│ │ ├── ConvertImage.jsx
│ │ ├── ResizeImage.jsx
│
├── services
│ ├── api.js
│
├── utils
│ ├── helpers.js

---

## 🎨 UI Design Rules

### ✅ Must Follow

- Clean layout with proper spacing
- Neutral color palette (white, gray, black)
- One accent color (blue or teal)
- Soft shadows and rounded corners
- Responsive design

### ❌ Avoid

- Overuse of animations
- Bright/random colors
- Cluttered UI
- Heavy gradients

---

## 🖥 Page Layout Standard

### Home Page

- Grid of tool cards
- Each card → single functionality

### Tool Page

1. Title
2. File Upload Area
3. Options (if required)
4. Process Button
5. Result Section

---

## 📦 Components

### FileUpload

- Drag & Drop support
- Multiple file upload
- File preview

### Loader

- Spinner while processing

### ToolCard

- Icon + Title + Description

---

## 🔗 API Service

/services/api.js

```javascript
import axios from "axios";

const API = axios.create({
  baseURL: "https://localhost:5001/api",
});

export default API;
```

---

## 🚀 Example API Call

```javascript
export const mergePdf = async (files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const response = await API.post("/pdf/merge", formData);
  return response.data;
};
```

---

# ⚙️ 5. BACKEND (.NET Core Web API)

## 📁 Folder Structure

/Controllers
├── PdfController.cs
├── ImageController.cs

/Services
├── Interfaces
│ ├── IPdfService.cs
│ ├── IImageService.cs
├── Implementations
│ ├── PdfService.cs
│ ├── ImageService.cs

/Models
├── RequestModels.cs

/Helpers
├── FileHelper.cs

/TempFiles

---

## 🔌 API Endpoints

### PDF APIs

POST /api/pdf/merge
POST /api/pdf/compress
POST /api/pdf/image-to-pdf
POST /api/pdf/pdf-to-image
POST /api/pdf/compare

---

### Image APIs

POST /api/image/compress
POST /api/image/convert
POST /api/image/resize
POST /api/image/compare

---

## 📥 Request Format

- Content-Type: multipart/form-data

Example:

files: [file1, file2]
quality: 70
format: jpg

---

## 📤 Response

Return file:

```csharp
return File(bytes, "application/pdf", "output.pdf");
```

---

## 🧠 Service Responsibilities

### PdfService

- Merge PDFs
- Compress PDF
- Convert Image → PDF
- Convert PDF → Image

### ImageService

- Compress Image
- Convert Format
- Resize Image

---

## 🧹 File Handling

- Store files in TempFiles
- Delete after processing
- Validate file type and size

---

## ⚠️ Validation Rules

- Max file size: 50MB
- Allowed formats:
  - PDF
  - JPG
  - PNG
  - JPEG
  - WEBP

---

## ⚡ Performance

- Use async/await
- Stream files instead of loading full memory
- Optimize image compression

---

## 🔐 Security

- Validate file extensions
- Prevent malicious uploads
- Sanitize file names

---

# 🔄 6. APPLICATION FLOW

1. User selects tool
2. Uploads file(s)
3. Clicks process
4. API request sent
5. Backend processes file
6. Result returned
7. User downloads file

---

# 🧪 7. TESTING

- Upload multiple files
- Test large file handling
- Validate invalid formats
- API error handling
- UI responsiveness

---

# 🚀 8. FUTURE IMPROVEMENTS

- JWT Authentication
- File history tracking
- Cloud storage (Azure / AWS)
- Batch processing
- Progress bar
- Dark mode

---

# 📌 9. FINAL NOTES

- Keep UI simple and professional
- Keep backend modular
- Each feature should be independent
- Focus on performance and usability

---
