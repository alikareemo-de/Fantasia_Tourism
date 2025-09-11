using Fantasis_Tourism_DataAccess.Model;

namespace Fantasis_Tourism_Service.Service
{
    public interface IPropertyService
    {
        Task<bool> AddPropertyAsync(Property property);
        Task<bool> UploadImage(UploadImageRequest requests);
        Task<bool> AddPropImage(List<PropertyImage> images);
        Task<List<PropertyDto>> GetAllProperties(string userId = "");
        Task<List<PropertyDto>> GetAllLastProperties();
        Task<PropertyDto> GetPropertyById(string Id);
        Task<bool> DeleteProperty(string Id);
        Task<bool> UpdateProerty(PropertyDto property);


    }
}
