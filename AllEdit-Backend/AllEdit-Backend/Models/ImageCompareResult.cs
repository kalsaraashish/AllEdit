namespace AllEdit_Backend.Models;

public sealed class ImageCompareResult
{
    public bool AreIdentical { get; init; }

    public double DifferencePercentage { get; init; }

    public int Width { get; init; }

    public int Height { get; init; }
}