using AllEdit_Backend.Helpers;
using AllEdit_Backend.Models;
using AllEdit_Backend.Services.Interfaces;
using Docnet.Core;
using Docnet.Core.Models;
using PdfSharpCore.Drawing;
using PdfSharpCore.Pdf;
using PdfSharpCore.Pdf.IO;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using Syncfusion.DocIO;
using Syncfusion.DocIO.DLS;
using Syncfusion.DocIORenderer;
using Syncfusion.Presentation;
using Syncfusion.PresentationRenderer;
using Syncfusion.XlsIO;
using Syncfusion.XlsIORenderer;
using System.Diagnostics;
using System.IO.Compression;

namespace AllEdit_Backend.Services.Implementations;

public sealed class PdfService : IPdfService
{
    public async Task<byte[]> MergeAsync(IReadOnlyCollection<IFormFile> files, CancellationToken cancellationToken = default)
    {
        ValidatePdfFiles(files);

        await using var output = new MemoryStream();
        using (var pdfWriter = new iText.Kernel.Pdf.PdfWriter(output))
        using (var outputDocument = new iText.Kernel.Pdf.PdfDocument(pdfWriter))
        {
            var merger = new iText.Kernel.Utils.PdfMerger(outputDocument);

            foreach (var file in files)
            {
                cancellationToken.ThrowIfCancellationRequested();

                await using var input = file.OpenReadStream();
                using var pdfReader = new iText.Kernel.Pdf.PdfReader(input);
                using var document = new iText.Kernel.Pdf.PdfDocument(pdfReader);

                merger.Merge(document, 1, document.GetNumberOfPages());
            }
        }

        return output.ToArray();
    }

    public async Task<byte[]> CompressAsync(IFormFile file, CancellationToken cancellationToken = default)
    {
        FileHelper.ValidatePdfFile(file);

        await using var input = file.OpenReadStream();
        using var document = PdfReader.Open(input, PdfDocumentOpenMode.Import);

        var outputDocument = new PdfDocument();
        foreach (var page in document.Pages)
        {
            outputDocument.AddPage(page);
        }

        await using var output = new MemoryStream();
        outputDocument.Save(output, false);
        return output.ToArray();
    }

    public async Task<byte[]> WordToPdfAsync(IFormFile file, CancellationToken cancellationToken = default)
    {
        FileHelper.ValidateWordFile(file);
        await using var inputStream = file.OpenReadStream();
        using var document = new WordDocument(inputStream, Syncfusion.DocIO.FormatType.Automatic);
        using var render = new DocIORenderer();
        using var pdfDocument = render.ConvertToPDF(document);
        await using var outputStream = new MemoryStream();
        pdfDocument.Save(outputStream);
        return outputStream.ToArray();
    }

    public async Task<byte[]> PowerPointToPdfAsync(IFormFile file, CancellationToken cancellationToken = default)
    {
        FileHelper.ValidatePowerPointFile(file);
        await using var inputStream = file.OpenReadStream();
        using var presentation = Presentation.Open(inputStream);
        using var pdfDocument = PresentationToPdfConverter.Convert(presentation);
        await using var outputStream = new MemoryStream();
        pdfDocument.Save(outputStream);
        return outputStream.ToArray();
    }

    public async Task<byte[]> ExcelToPdfAsync(IFormFile file, CancellationToken cancellationToken = default)
    {
        FileHelper.ValidateSpreadsheetFile(file);
        await using var inputStream = file.OpenReadStream();
        using var engine = new ExcelEngine();
        var application = engine.Excel;
        var workbook = application.Workbooks.Open(inputStream);
        var renderer = new XlsIORenderer();
        using var pdfDocument = renderer.ConvertToPDF(workbook);
        await using var outputStream = new MemoryStream();
        pdfDocument.Save(outputStream);
        return outputStream.ToArray();
    }

    public async Task<byte[]> PdfToWordAsync(IFormFile file, CancellationToken cancellationToken = default)
    {
        FileHelper.ValidatePdfFile(file);

        var zipBytes = await PdfToImageArchiveAsync(file, 150, "png", cancellationToken);

        using var zipArchive = new ZipArchive(new MemoryStream(zipBytes), ZipArchiveMode.Read);
        using var wordDocument = new WordDocument();
        
        var entries = zipArchive.Entries.OrderBy(e => 
        {
            var name = Path.GetFileNameWithoutExtension(e.Name);
            var numStr = name.Replace("page-", "");
            return int.TryParse(numStr, out var num) ? num : 0;
        }).ToList();

        foreach (var entry in entries)
        {
            cancellationToken.ThrowIfCancellationRequested();
            await using var entryStream = entry.Open();
            await using var memStream = new MemoryStream();
            await entryStream.CopyToAsync(memStream, cancellationToken);
            memStream.Position = 0;

            var section = wordDocument.AddSection();
            section.PageSetup.PageSize = new Syncfusion.Drawing.SizeF(595, 842);
            section.PageSetup.Margins.All = 0;

            var paragraph = section.AddParagraph();
            var picture = paragraph.AppendPicture(memStream);
            
            picture.Width = section.PageSetup.PageSize.Width;
            picture.Height = section.PageSetup.PageSize.Height;
        }

        await using var outputStream = new MemoryStream();
        wordDocument.Save(outputStream, Syncfusion.DocIO.FormatType.Docx);
        return outputStream.ToArray();
    }

    public async Task<byte[]> DocumentsToPdfAsync(IReadOnlyCollection<IFormFile> files, CancellationToken cancellationToken = default)
    {
        ValidateMixedFiles(files);

        var pdfFiles = new List<byte[]>(files.Count);
        foreach (var file in files)
        {
            pdfFiles.Add(await ConvertMixedFileToPdfAsync(file, cancellationToken));
        }

        return await MergePdfBytesAsync(pdfFiles, cancellationToken);
    }

    public async Task<byte[]> ImageToPdfAsync(IReadOnlyCollection<IFormFile> files, CancellationToken cancellationToken = default)
    {
        ValidateImageFiles(files);

        try
        {
            var outputDocument = new PdfDocument();

            foreach (var file in files)
            {
                await using var input = file.OpenReadStream();
                using var image = await Image.LoadAsync<Rgba32>(input, cancellationToken);

                var page = outputDocument.AddPage();
                page.Width = image.Width * 72d / 96d;
                page.Height = image.Height * 72d / 96d;

                await using var ms = new MemoryStream();
                await image.SaveAsJpegAsync(ms, cancellationToken);
                var compatibleBytes = ms.ToArray();

                using var graphics = XGraphics.FromPdfPage(page);
                using var xImage = XImage.FromStream(() => new MemoryStream(compatibleBytes));
                graphics.DrawImage(xImage, 0, 0, page.Width, page.Height);
            }

            await using var output = new MemoryStream();
            outputDocument.Save(output, false);
            return output.ToArray();
        }
        catch (ArgumentException)
        {
            throw;
        }
        catch (Exception ex)
        {
            throw new ArgumentException($"Unable to create PDF from images: {ex.Message}");
        }
    }

    public async Task<byte[]> PdfToImageArchiveAsync(IFormFile file, int dpi, string format, CancellationToken cancellationToken = default)
    {
        FileHelper.ValidatePdfFile(file);

        if (dpi <= 0)
        {
            throw new ArgumentException("DPI must be greater than zero.");
        }

        var normalizedFormat = NormalizeImageFormat(format);

        var pdfBytes = await FileHelper.ReadFileBytesAsync(file, cancellationToken);

        try
        {
            using var pdfDocument = PdfReader.Open(new MemoryStream(pdfBytes), PdfDocumentOpenMode.ReadOnly);

            await using var output = new MemoryStream();
            using (var archive = new ZipArchive(output, ZipArchiveMode.Create, leaveOpen: true))
            {
                for (var pageIndex = 0; pageIndex < pdfDocument.PageCount; pageIndex++)
                {
                    var page = pdfDocument.Pages[pageIndex];
                    var renderWidth = Math.Max(1, (int)Math.Round(page.Width.Point * dpi / 72d));
                    var renderHeight = Math.Max(1, (int)Math.Round(page.Height.Point * dpi / 72d));

                    byte[]? pixelBytes = null;
                    Exception? firstEx = null;

                    try
                    {
                        using var docReader = DocLib.Instance.GetDocReader(pdfBytes, new PageDimensions(renderWidth, renderHeight));
                        using var pageReader = docReader.GetPageReader(pageIndex);
                        pixelBytes = pageReader.GetImage();
                    }
                    catch (Exception ex)
                    {
                        firstEx = ex;
                        try
                        {
                            using var docReader = DocLib.Instance.GetDocReader(pdfBytes, new PageDimensions(renderHeight, renderWidth));
                            using var pageReader = docReader.GetPageReader(pageIndex);
                            pixelBytes = pageReader.GetImage();
                        }
                        catch (Exception ex2)
                        {
                            throw new ArgumentException($"Unable to render PDF page (first error: {firstEx.Message}; fallback error: {ex2.Message})");
                        }
                    }

                    var expectedLength = checked(renderWidth * renderHeight * 4);
                    if (pixelBytes is null || pixelBytes.Length == 0)
                    {
                        throw new ArgumentException("Unable to render PDF page: empty pixel buffer.");
                    }

                    if (pixelBytes.Length != expectedLength)
                    {
                        if (pixelBytes.Length < expectedLength)
                        {
                            var padded = new byte[expectedLength];
                            Buffer.BlockCopy(pixelBytes, 0, padded, 0, pixelBytes.Length);
                            pixelBytes = padded;
                        }
                        else
                        {
                            var trimmed = new byte[expectedLength];
                            Buffer.BlockCopy(pixelBytes, 0, trimmed, 0, expectedLength);
                            pixelBytes = trimmed;
                        }
                    }

                    using var renderedImage = Image.LoadPixelData<Bgra32>(pixelBytes, renderWidth, renderHeight);
                    await using var imageStream = new MemoryStream();

                    var ext = normalizedFormat;
                    switch (normalizedFormat)
                    {
                        case "jpg":
                        case "jpeg":
                            await renderedImage.SaveAsJpegAsync(imageStream, cancellationToken: cancellationToken);
                            ext = "jpg";
                            break;
                        default:
                            await renderedImage.SaveAsPngAsync(imageStream, cancellationToken);
                            ext = "png";
                            break;
                    }

                    var entry = archive.CreateEntry($"page-{pageIndex + 1}.{ext}", CompressionLevel.Optimal);
                    await using var entryStream = entry.Open();
                    imageStream.Position = 0;
                    await imageStream.CopyToAsync(entryStream, cancellationToken);
                }
            }

            return output.ToArray();
        }
        catch (ArgumentException)
        {
            throw;
        }
        catch (Exception ex)
        {
            throw new ArgumentException($"Unable to render PDF to images: {ex.Message}");
        }
    }

    public async Task<PdfCompareResult> CompareAsync(IFormFile firstFile, IFormFile secondFile, CancellationToken cancellationToken = default)
    {
        FileHelper.ValidatePdfFile(firstFile);
        FileHelper.ValidatePdfFile(secondFile);

        var firstBytes = await FileHelper.ReadFileBytesAsync(firstFile, cancellationToken);
        var secondBytes = await FileHelper.ReadFileBytesAsync(secondFile, cancellationToken);

        using var firstDocument = PdfReader.Open(new MemoryStream(firstBytes), PdfDocumentOpenMode.ReadOnly);
        using var secondDocument = PdfReader.Open(new MemoryStream(secondBytes), PdfDocumentOpenMode.ReadOnly);

        var areIdentical = firstBytes.AsSpan().SequenceEqual(secondBytes);
        var pageCountDifference = Math.Abs(firstDocument.PageCount - secondDocument.PageCount);
        var byteDifferenceRatio = CalculateByteDifference(firstBytes, secondBytes);
        var differencePercentage = Math.Round(Math.Min(100d, (pageCountDifference * 10d) + byteDifferenceRatio), 2);

        return new PdfCompareResult
        {
            AreIdentical = areIdentical,
            DifferencePercentage = differencePercentage,
            FirstPageCount = firstDocument.PageCount,
            SecondPageCount = secondDocument.PageCount
        };
    }

    private async Task<byte[]> ConvertMixedFileToPdfAsync(IFormFile file, CancellationToken cancellationToken)
    {
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

        return extension switch
        {
            ".pdf" => await FileHelper.ReadFileBytesAsync(file, cancellationToken),
            ".doc" or ".docx" => await WordToPdfAsync(file, cancellationToken),
            ".xls" or ".xlsx" => await ExcelToPdfAsync(file, cancellationToken),
            ".ppt" or ".pptx" => await PowerPointToPdfAsync(file, cancellationToken),
            ".jpg" or ".jpeg" or ".png" or ".webp" or ".gif" => await ImageToPdfAsync(new[] { file }, cancellationToken),
            _ => throw new ArgumentException($"Unsupported file format: {extension}")
        };
    }



    private async Task<byte[]> MergePdfBytesAsync(IReadOnlyCollection<byte[]> pdfBytes, CancellationToken cancellationToken)
    {
        if (pdfBytes is null || pdfBytes.Count == 0)
        {
            throw new ArgumentException("At least one file is required.");
        }

        await using var output = new MemoryStream();
        using (var pdfWriter = new iText.Kernel.Pdf.PdfWriter(output))
        using (var outputDocument = new iText.Kernel.Pdf.PdfDocument(pdfWriter))
        {
            var merger = new iText.Kernel.Utils.PdfMerger(outputDocument);

            foreach (var bytes in pdfBytes)
            {
                cancellationToken.ThrowIfCancellationRequested();

                using var input = new MemoryStream(bytes);
                using var pdfReader = new iText.Kernel.Pdf.PdfReader(input);
                using var document = new iText.Kernel.Pdf.PdfDocument(pdfReader);

                merger.Merge(document, 1, document.GetNumberOfPages());
            }
        }

        return output.ToArray();
    }

    private static string NormalizeImageFormat(string? format)
    {
        var value = (format ?? string.Empty).Trim().TrimStart('.').ToLowerInvariant();
        if (string.IsNullOrWhiteSpace(value))
        {
            return "png";
        }

        return value switch
        {
            "jpg" or "jpeg" => value,
            "png" => "png",
            _ => throw new ArgumentException("Unsupported output format. Use jpg or png.")
        };
    }

    private static void ValidatePdfFiles(IReadOnlyCollection<IFormFile> files)
    {
        if (files is null || files.Count == 0)
        {
            throw new ArgumentException("At least one PDF file is required.");
        }

        foreach (var file in files)
        {
            FileHelper.ValidatePdfFile(file);
        }
    }

    private static void ValidateImageFiles(IReadOnlyCollection<IFormFile> files)
    {
        if (files is null || files.Count == 0)
        {
            throw new ArgumentException("At least one image file is required.");
        }

        foreach (var file in files)
        {
            FileHelper.ValidateImageFile(file);
        }
    }

    private static void ValidateMixedFiles(IReadOnlyCollection<IFormFile> files)
    {
        if (files is null || files.Count == 0)
        {
            throw new ArgumentException("At least one file is required.");
        }

        foreach (var file in files)
        {
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            switch (extension)
            {
                case ".pdf":
                    FileHelper.ValidatePdfFile(file);
                    break;
                case ".doc":
                case ".docx":
                    FileHelper.ValidateWordFile(file);
                    break;
                case ".xls":
                case ".xlsx":
                    FileHelper.ValidateSpreadsheetFile(file);
                    break;
                case ".ppt":
                case ".pptx":
                    FileHelper.ValidatePowerPointFile(file);
                    break;
                case ".jpg":
                case ".jpeg":
                case ".png":
                case ".webp":
                case ".gif":
                    FileHelper.ValidateImageFile(file);
                    break;
                default:
                    throw new ArgumentException($"Unsupported file format: {extension}");
            }
        }
    }

    private static double CalculateByteDifference(IReadOnlyList<byte> firstBytes, IReadOnlyList<byte> secondBytes)
    {
        var maxLength = Math.Max(firstBytes.Count, secondBytes.Count);
        if (maxLength == 0)
        {
            return 0;
        }

        var difference = 0L;

        for (var index = 0; index < maxLength; index++)
        {
            var firstByte = index < firstBytes.Count ? firstBytes[index] : (byte)0;
            var secondByte = index < secondBytes.Count ? secondBytes[index] : (byte)0;
            difference += Math.Abs(firstByte - secondByte);
        }

        return (difference * 100d) / (maxLength * byte.MaxValue);
    }
}