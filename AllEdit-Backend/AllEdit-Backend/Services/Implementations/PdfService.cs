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
using System.IO.Compression;

namespace AllEdit_Backend.Services.Implementations;

public sealed class PdfService : IPdfService
{
    public async Task<byte[]> MergeAsync(IReadOnlyCollection<IFormFile> files, CancellationToken cancellationToken = default)
    {
        ValidatePdfFiles(files);

        var outputDocument = new PdfDocument();

        foreach (var file in files)
        {
            await using var input = file.OpenReadStream();
            using var document = PdfReader.Open(input, PdfDocumentOpenMode.Import);

            foreach (var page in document.Pages)
            {
                outputDocument.AddPage(page);
            }
        }

        await using var output = new MemoryStream();
        outputDocument.Save(output, false);
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

                // Explicitly convert to Jpeg format which is natively supported by XImage.
                // Raw MemoryStream of WebP/GIF formats throws exceptions leading to 400 Bad Request.
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

                    // Try rendering with the computed dimensions. If that fails (some PDFs require
                    // alternate orientation or a different dimension ordering), retry with swapped
                    // width/height as a fallback.
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
                        // attempt fallback by swapping dimensions
                        try
                        {
                            using var docReader = DocLib.Instance.GetDocReader(pdfBytes, new PageDimensions(renderHeight, renderWidth));
                            using var pageReader = docReader.GetPageReader(pageIndex);
                            pixelBytes = pageReader.GetImage();
                        }
                        catch (Exception ex2)
                        {
                            // If both attempts fail, surface a combined message for diagnostics.
                            throw new ArgumentException($"Unable to render PDF page (first error: {firstEx.Message}; fallback error: {ex2.Message})");
                        }
                    }

                    // Ensure the pixel buffer length matches the expected size for Bgra32 (4 bytes per pixel).
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
                        else // larger than expected - trim just in case
                        {
                            var trimmed = new byte[expectedLength];
                            Buffer.BlockCopy(pixelBytes, 0, trimmed, 0, expectedLength);
                            pixelBytes = trimmed;
                        }
                    }

                    using var renderedImage = SixLabors.ImageSharp.Image.LoadPixelData<Bgra32>(pixelBytes, renderWidth, renderHeight);
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