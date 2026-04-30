using AllEdit_Backend.Models;

namespace AllEdit_Backend.Services.Interfaces;

public interface IPdfService
{
    Task<byte[]> MergeAsync(IReadOnlyCollection<IFormFile> files, CancellationToken cancellationToken = default);

    Task<byte[]> CompressAsync(IFormFile file, CancellationToken cancellationToken = default);

    Task<byte[]> WordToPdfAsync(IFormFile file, CancellationToken cancellationToken = default);

    Task<byte[]> PdfToWordAsync(IFormFile file, CancellationToken cancellationToken = default);

    Task<byte[]> ExcelToPdfAsync(IFormFile file, CancellationToken cancellationToken = default);

    Task<byte[]> PowerPointToPdfAsync(IFormFile file, CancellationToken cancellationToken = default);

    Task<byte[]> DocumentsToPdfAsync(IReadOnlyCollection<IFormFile> files, CancellationToken cancellationToken = default);

    Task<byte[]> ImageToPdfAsync(IReadOnlyCollection<IFormFile> files, CancellationToken cancellationToken = default);

    Task<byte[]> PdfToImageArchiveAsync(IFormFile file, int dpi, string format, CancellationToken cancellationToken = default);

    Task<PdfCompareResult> CompareAsync(IFormFile firstFile, IFormFile secondFile, CancellationToken cancellationToken = default);
}