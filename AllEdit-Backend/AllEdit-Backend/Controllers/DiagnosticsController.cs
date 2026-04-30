using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using SixLabors.ImageSharp;

namespace AllEdit_Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class DiagnosticsController : ControllerBase
{
    [HttpGet("imagesharp")]
    public IActionResult ImageSharpInfo()
    {
        var assembly = typeof(Image).Assembly;
        var info = new
        {
            AssemblyFullName = assembly.FullName,
            Location = assembly.IsDynamic ? null : assembly.Location,
            Version = assembly.GetName().Version?.ToString() ?? "unknown"
        };

        return Ok(info);
    }

    [HttpGet("assemblies")]
    public IActionResult Assemblies()
    {
        var loaded = AppDomain.CurrentDomain.GetAssemblies()
            .Select(a => new
            {
                Name = a.GetName().Name,
                Version = a.GetName().Version?.ToString(),
                Location = a.IsDynamic ? null : a.Location
            })
            .OrderBy(a => a.Name)
            .ToArray();

        return Ok(loaded);
    }
}
