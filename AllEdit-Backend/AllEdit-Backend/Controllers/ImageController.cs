using AllEdit_Backend.Models;
using AllEdit_Backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AllEdit_Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class ImageController : ControllerBase
{
    private readonly IImageService _imageService;

    public ImageController(IImageService imageService)
    {
        _imageService = imageService;
    }

    [HttpPost("compress")]
    [RequestSizeLimit(50L * 1024L * 1024L)]
    public Task<IActionResult> Compress([FromForm] CompressImageRequest request, CancellationToken cancellationToken)
        => ExecuteFileAsync(() => _imageService.CompressAsync(request.file, request.quality, cancellationToken), GetOutputName(request.file.FileName, "compressed"), GetContentType(request.file.FileName));

    [HttpPost("convert")]
    [RequestSizeLimit(50L * 1024L * 1024L)]
    public Task<IActionResult> Convert([FromForm] ConvertImageRequest request, CancellationToken cancellationToken)
        => ExecuteFileAsync(() => _imageService.ConvertAsync(request.file, request.format, cancellationToken), $"converted.{request.format.TrimStart('.')}", GetContentType($"output.{request.format}"));

    [HttpPost("resize")]
    [RequestSizeLimit(50L * 1024L * 1024L)]
    public Task<IActionResult> Resize([FromForm] ResizeImageRequest request, CancellationToken cancellationToken)
        => ExecuteFileAsync(() => _imageService.ResizeAsync(request.file, request.width, request.height, request.keepAspectRatio, cancellationToken), GetOutputName(request.file.FileName, "resized"), GetContentType(request.file.FileName));

    [HttpPost("compare")]
    [RequestSizeLimit(50L * 1024L * 1024L)]
    public Task<IActionResult> Compare([FromForm] CompareImageRequest request, CancellationToken cancellationToken)
        => ExecuteJsonAsync(() => _imageService.CompareAsync(request.firstFile, request.secondFile, cancellationToken));

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

    private static string GetOutputName(string originalFileName, string suffix)
    {
        var extension = Path.GetExtension(originalFileName);
        return string.IsNullOrWhiteSpace(extension) ? $"{suffix}.jpg" : $"{suffix}{extension}";
    }

    private static string GetContentType(string fileName)
    {
        return Path.GetExtension(fileName).ToLowerInvariant() switch
        {
            ".png" => "image/png",
            ".webp" => "image/webp",
            _ => "image/jpeg"
        };
    }
}