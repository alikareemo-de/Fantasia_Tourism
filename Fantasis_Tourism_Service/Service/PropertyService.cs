using Fantasis_Tourism_DataAccess.Model;
using Fantasis_Tourism_DataAccess.Services;
using Microsoft.Extensions.Logging;

namespace Fantasis_Tourism_Service.Service
{
    public class PropertyService : IPropertyService
    {
        private readonly IPropertyRepository _propertyRepository;
        private readonly ILogger<PropertyService> _logger;

        public PropertyService(IPropertyRepository propertyRepository, ILogger<PropertyService> logger)
        {
            _propertyRepository = propertyRepository;
            _logger = logger;
        }

        public async Task<bool> AddPropertyAsync(Property property)
        {
            try
            {
                property.CreatedDate = DateTime.Now;
                bool add = await _propertyRepository.AddAsync(property);
                if (add)
                {
                    return true;

                }
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return false;

            }
        }

        public async Task<bool> UploadImage(UploadImageRequest requests)
        {
            try
            {
                foreach (var request in requests.Images)
                {
                    if (request == null || request.Length == 0)
                        return false;

                    var imagesFolder = Path.Combine(Directory.GetCurrentDirectory(), "images");

                    if (!Directory.Exists(imagesFolder))
                    {
                        Directory.CreateDirectory(imagesFolder);
                    }

                    var fileName = request.FileName;
                    var filePath = Path.Combine(imagesFolder, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await request.CopyToAsync(stream);
                    }

                }

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return false;

            }
        }

        public async Task<bool> AddPropImage(List<PropertyImage> images)
        {
            try
            {
                bool add = await _propertyRepository.AddPropImage(images);
                if (add) return true;

                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return false;
            }
        }

        public async Task<List<PropertyDto>> GetAllProperties(string userId = "")
        {
            try
            {
                var result = await _propertyRepository.GetAllProperties(userId);
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return null;
            }
        }

        public async Task<PropertyDto> GetPropertyById(string Id)
        {
            try
            {
                var result = await _propertyRepository.GetPropertyById(Id);
                return result;

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return null;
            }
        }
        public async Task<List<PropertyDto>> GetAllLastProperties()
        {
            try
            {
                var result = await _propertyRepository.GetAllLastProperties();
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return null;

            }
        }

        public async Task<bool> DeleteProperty(string Id)
        {
            try
            {
                return await _propertyRepository.DeleteProperty(Id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return false;
            }
        }

        public async Task<bool> UpdateProerty(PropertyDto property)
        {
            try
            {
                Property newprop = new Property
                {
                    Id = property.Id,
                    UserId = property.UserId,
                    PropertyName = property.PropertyName,
                    Type = (int)property.Type,
                    Description = property.Description,
                    Capacity = property.Capacity,
                    PricePerNight = property.PricePerNight,
                    Rooms = property.Rooms,
                    Country = property.Country,
                    City = property.City,
                    ExpireDate = property.ExpireDate,
                    Status = property.Status,
                    Location = property.Location,
                    TripPlan = property.TripPlan,
                    HasCar = property.HasCar,
                    features = string.Join(',', property.features),
                    Images = property.Images

                };
                return await _propertyRepository.UpdateProerty(newprop);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return false;

            }
        }
    }
}
