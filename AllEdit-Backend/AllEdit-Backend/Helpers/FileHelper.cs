namespace AllEdit_Backend.Helpers;

public static class FileHelper
{
    private const long MaxFileSizeBytes = 50L * 1024L * 1024L;

    private static readonly HashSet<string> AllowedPdfExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".pdf"
    };

    private static readonly HashSet<string> AllowedImageExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
        ".gif"
    };


    public static string EnsureTempFolder()
    {
        var tempFolder = Path.Combine(AppContext.BaseDirectory, "TempFiles");
        Directory.CreateDirectory(tempFolder);
        return tempFolder;
    }

    public static void ValidatePdfFile(IFormFile file)
    {
        ValidateFile(file, AllowedPdfExtensions, "PDF");
    }

    public static void ValidateImageFile(IFormFile file)
    {
        ValidateFile(file, AllowedImageExtensions, "image");
    }

    public static async Task<byte[]> ReadFileBytesAsync(IFormFile file, CancellationToken cancellationToken = default)
    {
        await using var stream = file.OpenReadStream();
        await using var memory = new MemoryStream();
        await stream.CopyToAsync(memory, cancellationToken);
        return memory.ToArray();
    }

    private static void ValidateFile(IFormFile file, ISet<string> allowedExtensions, string fileLabel)
    {
        if (file is null)
        {
            throw new ArgumentException($"{fileLabel} file is required.");
        }

        if (file.Length <= 0)
        {
            throw new ArgumentException($"{fileLabel} file is empty.");
        }

        if (file.Length > MaxFileSizeBytes)
        {
            throw new ArgumentException($"{fileLabel} file must be 50 MB or smaller.");
        }

        var extension = Path.GetExtension(file.FileName);
        if (string.IsNullOrWhiteSpace(extension) || !allowedExtensions.Contains(extension))
        {
            throw new ArgumentException($"Unsupported {fileLabel.ToLowerInvariant()} format: {extension}");
        }
    }
}