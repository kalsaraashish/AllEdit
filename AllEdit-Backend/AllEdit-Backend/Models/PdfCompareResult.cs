namespace AllEdit_Backend.Models;

public sealed class PdfCompareResult
{
    public bool AreIdentical { get; init; }

    public double DifferencePercentage { get; init; }

    public int FirstPageCount { get; init; }

    public int SecondPageCount { get; init; }
}