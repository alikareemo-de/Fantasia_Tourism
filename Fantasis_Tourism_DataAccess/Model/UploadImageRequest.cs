using Microsoft.AspNetCore.Http;

namespace Fantasis_Tourism_DataAccess.Model
{
    public class UploadImageRequest
    {
        public List<IFormFile> Images { get; set; }
    }
}
