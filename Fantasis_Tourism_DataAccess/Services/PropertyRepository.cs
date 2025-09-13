using Fantasis_Tourism_DataAccess.Enums;
using Fantasis_Tourism_DataAccess.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Fantasis_Tourism_DataAccess.Services
{
    public class PropertyRepository : IPropertyRepository
    {
        private readonly Fantasis_TourismDbContext _context;
        private readonly ILogger<PropertyRepository> _logger;

        public PropertyRepository(Fantasis_TourismDbContext context, ILogger<PropertyRepository> logger)
        {
            _context = context;
            _logger = logger;
        }


        public async Task<bool> AddPropImage(List<PropertyImage> Images)
        {
            try
            {
                await _context.PropertyImages.AddRangeAsync(Images);

                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return false;
            }
        }
        public async Task<bool> AddAsync(Fantasis_Tourism_DataAccess.Model.Property property)
        {
            try
            {
                await _context.Property.AddAsync(property);

                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return false;
            }

        }


        public async Task<List<PropertyDto>> GetAllLastProperties()
        {
            try
            {
                var properties = await _context.Property
        .Include(p => p.Images)
        .OrderByDescending(p => p.CreatedDate)
        .Take(5)
        .Select(p => new PropertyDto
        {
            Id = p.Id,
            UserId = p.UserId,
            PropertyName = p.PropertyName,
            Type = (PropertyType)p.Type,
            Description = p.Description,
            Capacity = p.Capacity,
            PricePerNight = p.PricePerNight,
            Status = p.Status,
            City = p.City,
            Country = p.Country,
            Location = p.Location,
            Rooms = p.Rooms,
            HasCar = p.HasCar,
            TripPlan = p.TripPlan,
            CreatedDate = p.CreatedDate,
            Images = p.Images
                .Where(img => img.IsMain)
                .ToList()
        })
        .ToListAsync();
                return properties;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return null;
            }
        }


        public async Task<List<PropertyDto>> GetProperties(string userId = "")
        {
            try
            {
                var query = _context.Property
        .Include(p => p.Images)
        .AsQueryable();

                if (!string.IsNullOrWhiteSpace(userId))
                {
                    if (Guid.TryParse(userId, out Guid userGuid))
                    {
                        query = query.Where(p => p.UserId != userGuid);
                    }
                }

                query = query.OrderByDescending(p => p.CreatedDate);

                var properties = await query
                    .Select(p => new PropertyDto
                    {
                        Id = p.Id,
                        UserId = p.UserId,
                        PropertyName = p.PropertyName,
                        Type = (PropertyType)p.Type,
                        Description = p.Description,
                        Capacity = p.Capacity,
                        PricePerNight = p.PricePerNight,
                        Status = p.Status,
                        City = p.City,
                        Country = p.Country,
                        Location = p.Location,
                        Rooms = p.Rooms,
                        HasCar = p.HasCar,
                        TripPlan = p.TripPlan,
                        CreatedDate = p.CreatedDate,
                        Images = p.Images
                            .Where(img => img.IsMain)
                            .ToList()
                    })
                    .ToListAsync();

                return properties;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return null;

            }
        }



        public async Task<List<PropertyDto>> GetAllProperties(string userId = "")
        {
            try
            {
                var query = _context.Property
        .Include(p => p.Images)
        .AsQueryable();

                if (!string.IsNullOrWhiteSpace(userId))
                {
                    if (Guid.TryParse(userId, out Guid userGuid))
                    {
                        query = query.Where(p => p.UserId == userGuid);
                    }
                }

                query = query.OrderByDescending(p => p.CreatedDate);

                var properties = await query
                    .Select(p => new PropertyDto
                    {
                        Id = p.Id,
                        UserId = p.UserId,
                        PropertyName = p.PropertyName,
                        Type = (PropertyType)p.Type,
                        Description = p.Description,
                        Capacity = p.Capacity,
                        PricePerNight = p.PricePerNight,
                        Status = p.Status,
                        City = p.City,
                        Country = p.Country,
                        Location = p.Location,
                        Rooms = p.Rooms,
                        HasCar = p.HasCar,
                        TripPlan = p.TripPlan,
                        CreatedDate = p.CreatedDate,
                        Images = p.Images
                            .Where(img => img.IsMain)
                            .ToList()
                    })
                    .ToListAsync();

                return properties;
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
                if (!Guid.TryParse(Id, out Guid propertyId))
                    return null;


                var property = await _context.Property
                    .Include(p => p.Images)
                    .Where(p => p.Id == propertyId)
                    .Select(p => new PropertyDto
                    {
                        Id = p.Id,
                        UserId = p.UserId,
                        PropertyName = p.PropertyName,
                        Type = (PropertyType)p.Type,
                        Description = p.Description,
                        Capacity = p.Capacity,
                        PricePerNight = p.PricePerNight,
                        Status = p.Status,
                        City = p.City,
                        Country = p.Country,
                        Location = p.Location,
                        Rooms = p.Rooms,
                        HasCar = p.HasCar,
                        TripPlan = p.TripPlan,
                        CreatedDate = p.CreatedDate,
                        ExpireDate = p.ExpireDate,
                        Images = p.Images.ToList(),
                        features = string.IsNullOrEmpty(p.features)
                            ? Array.Empty<string>()
                            : p.features.Split(',', StringSplitOptions.RemoveEmptyEntries)
                    })
                    .FirstOrDefaultAsync();




                return property;
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
                var cuid = Guid.Parse(Id);
                var property = await _context.Property.FindAsync(cuid);
                if (property == null)
                {
                    _logger.LogError("Property not found");
                    return false;
                }

                _context.Property.Remove(property);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return false;
            }

        }

        public async Task<bool> UpdateProerty(Property property)
        {
            try
            {
                var existingProperty = await _context.Property
                    .Include(p => p.Images)
                    .FirstOrDefaultAsync(p => p.Id.ToString() == property.Id.ToString());
                if (existingProperty == null)
                {
                    _logger.LogError("Property not found.");
                    return false;
                }
                existingProperty.PropertyName = property.PropertyName;
                existingProperty.Description = property.Description;
                existingProperty.Type = property.Type;
                existingProperty.Capacity = property.Capacity;
                existingProperty.PricePerNight = property.PricePerNight;
                existingProperty.Status = property.Status;
                existingProperty.City = property.City;
                existingProperty.Country = property.Country;
                existingProperty.Location = property.Location;
                existingProperty.Rooms = property.Rooms;
                existingProperty.HasCar = property.HasCar;
                existingProperty.TripPlan = property.TripPlan;
                existingProperty.PricePerNight = property.PricePerNight;
                existingProperty.ExpireDate = property.ExpireDate;
                existingProperty.features = property.features;

                _context.PropertyImages.RemoveRange(existingProperty.Images);
                if (property.Images != null && property.Images.Any())
                {
                    foreach (var img in property.Images)
                    {
                        var newImage = new PropertyImage
                        {
                            Id = Guid.NewGuid(),
                            PropertyId = existingProperty.Id,
                            ImageName = img.ImageName,
                            IsMain = img.IsMain,
                            base64 = img.base64,
                            contentType = img.contentType
                        };

                        _context.PropertyImages.Add(newImage);
                    }
                }
                await _context.SaveChangesAsync();

                return true;


            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return false;
            }
        }
    }
}
