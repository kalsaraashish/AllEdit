using AllEdit_Backend.Models;
using AllEdit_Backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AllEdit_Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class PdfController : ControllerBase
{
    private readonly IPdfService _pdfService;

    public PdfController(IPdfService pdfService)
    {
        _pdfService = pdfService;
    }

    [HttpPost("merge")]
    [RequestSizeLimit(50L * 1024L * 1024L)]
    public async Task<IActionResult> Merge([FromForm] MergePdfRequest request, CancellationToken cancellationToken)
    {
        IReadOnlyCollection<IFormFile> files = request?.files ?? [];
        if ((files is null || files.Count == 0) && Request.HasFormContentType)
        {
            files = (await Request.ReadFormAsync(cancellationToken)).Files;
        }

        return await ExecuteFileAsync(() => _pdfService.MergeAsync(files ?? [], cancellationToken), "merged.pdf", "application/pdf");
    }

    [HttpPost("compress")]
    [RequestSizeLimit(50L * 1024L * 1024L)]
    public Task<IActionResult> Compress([FromForm] CompressPdfRequest request, CancellationToken cancellationToken)
        => ExecuteFileAsync(() => _pdfService.CompressAsync(request.file, cancellationToken), "compressed.pdf", "application/pdf");

    [HttpPost("image-to-pdf")]
    [RequestSizeLimit(50L * 1024L * 1024L)]
    public async Task<IActionResult> ImageToPdf([FromForm] ImageToPdfRequest request, CancellationToken cancellationToken)
    {
        IReadOnlyCollection<IFormFile> files = request?.files ?? [];
        if ((files is null || files.Count == 0) && Request.HasFormContentType)
        {
            files = (await Request.ReadFormAsync(cancellationToken)).Files;
        }

        return await ExecuteFileAsync(() => _pdfService.ImageToPdfAsync(files ?? [], cancellationToken), "images.pdf", "application/pdf");
    }

    [HttpPost("pdf-to-image")]
    [RequestSizeLimit(50L * 1024L * 1024L)]
    public Task<IActionResult> PdfToImage([FromForm] PdfToImageRequest request, CancellationToken cancellationToken)
        => ExecuteFileAsync(() => _pdfService.PdfToImageArchiveAsync(request.file, request.dpi, request.format, cancellationToken), "pages.zip", "application/zip");

    [HttpPost("compare")]
    [RequestSizeLimit(50L * 1024L * 1024L)]
    public Task<IActionResult> Compare([FromForm] ComparePdfRequest request, CancellationToken cancellationToken)
        => ExecuteJsonAsync(() => _pdfService.CompareAsync(request.firstFile, request.secondFile, cancellationToken));

    private async Task<IActionResult> ExecuteFileAsync(Func<Task<byte[]>> action, string fileName, string contentType)
    {
        try
        {
            var bytes = await action();
            return File(bytes, contentType, fileName);
        }
        catch (ArgumentException exception)
        {
            return BadRequest(exception.Message);
        }
    }

    private async Task<IActionResult> ExecuteJsonAsync<T>(Func<Task<T>> action)
    {
        try
        {
            var result = await action();
            return Ok(result);
        }
        catch (ArgumentException exception)
        {
            return BadRequest(exception.Message);
        }
    }

}