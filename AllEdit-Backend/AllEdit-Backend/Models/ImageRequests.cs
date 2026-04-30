namespace AllEdit_Backend.Models;

public sealed class CompressImageRequest
{
    public IFormFile file { get; set; } = default!;

    public int quality { get; set; } = 70;
}

public sealed class ConvertImageRequest
{
    public IFormFile file { get; set; } = default!;

    public string format { get; set; } = "jpg";
}

public sealed class ResizeImageRequest
{
    public IFormFile file { get; set; } = default!;

    public int width { get; set; }

    public int height { get; set; }

    public bool keepAspectRatio { get; set; } = true;
}

public sealed class CompareImageRequest
{
    public IFormFile firstFile { get; set; } = default!;

    public IFormFile secondFile { get; set; } = default!;
}