using AllEdit_Backend.Models;

namespace AllEdit_Backend.Services.Interfaces;

public interface IImageService
{
    Task<byte[]> CompressAsync(IFormFile file, int quality, CancellationToken cancellationToken = default);

    Task<byte[]> ConvertAsync(IFormFile file, string format, CancellationToken cancellationToken = default);

    Task<byte[]> ResizeAsync(IFormFile file, int width, int height, bool keepAspectRatio, CancellationToken cancellationToken = default);

    Task<ImageCompareResult> CompareAsync(IFormFile firstFile, IFormFile secondFile, CancellationToken cancellationToken = default);
}