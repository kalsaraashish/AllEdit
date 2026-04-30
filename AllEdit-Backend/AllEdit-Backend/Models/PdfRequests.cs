namespace AllEdit_Backend.Models;

public sealed class ImageToPdfRequest
{
    public List<IFormFile> files { get; set; } = [];
}

public sealed class PdfToImageRequest
{
    public IFormFile file { get; set; } = default!;
    public int dpi { get; set; } = 150;
    public string format { get; set; } = "png";
}

public sealed class MergePdfRequest
{
    public List<IFormFile> files { get; set; } = [];
}

public sealed class CompressPdfRequest
{
    public IFormFile file { get; set; } = default!;
}

public sealed class ComparePdfRequest
{
    public IFormFile firstFile { get; set; } = default!;

    public IFormFile secondFile { get; set; } = default!;
}