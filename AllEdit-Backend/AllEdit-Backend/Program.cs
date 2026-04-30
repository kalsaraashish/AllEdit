using Syncfusion.Licensing; // ✅ Add this

var builder = WebApplication.CreateBuilder(args);

// ✅ Register Syncfusion License HERE (VERY IMPORTANT)
SyncfusionLicenseProvider.RegisterLicense("Ngo9BigBOggjHTQxAR8/V1JHaF5cWWdCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdlWXtdcHRdQmZeWUd/XkVWYEo=");

// Add services to the container.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "https://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddControllers();

builder.Services.AddScoped<AllEdit_Backend.Services.Interfaces.IPdfService, AllEdit_Backend.Services.Implementations.PdfService>();
builder.Services.AddScoped<AllEdit_Backend.Services.Interfaces.IImageService, AllEdit_Backend.Services.Implementations.ImageService>();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHttpsRedirection();
}

app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

app.Run();