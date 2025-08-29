using Fantasis_Tourism_DataAccess.Model;

namespace Fantasis_Tourism_DataAccess.Services
{
    public interface IPropertyRepository
    {
        Task<bool> AddAsync(Property property);
        Task<bool> AddPropImage(List<PropertyImage> Images);
        Task<List<PropertyDto>> GetAllProperties(string userId = "");
        Task<List<PropertyDto>> GetAllLastProperties();
        Task<PropertyDto> GetPropertyById(string Id);
        Task<bool> DeleteProperty(string Id);

    }
}
