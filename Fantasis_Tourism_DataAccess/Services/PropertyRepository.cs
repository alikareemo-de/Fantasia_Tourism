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
                    .Select(p => new PropertyDto
                    {
                        Id = p.Id,
                        PropertyName = p.PropertyName,
                        Type = p.Type,
                        CreatedDate = p.CreatedDate,
                        Status = p.Status,
                        City = p.City,
                        Country = p.Country,
                        MainImage = p.Images

                        .Where(img => img.IsMain)
                        .Select(img => img.ImageUrl)
                        .FirstOrDefault()
                    }).OrderByDescending(p => p.CreatedDate).Take(5)
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
                if (string.IsNullOrEmpty(userId))
                {
                    var properties = await _context.Property
                                        .Select(p => new PropertyDto
                                        {
                                            Id = p.Id,
                                            PropertyName = p.PropertyName,
                                            Type = p.Type,
                                            Status = p.Status,
                                            City = p.City,
                                            Country = p.Country,
                                            MainImage = p.Images

                                            .Where(img => img.IsMain)
                                            .Select(img => img.ImageUrl)
                                            .FirstOrDefault()
                                        })
                                        .ToListAsync();

                    return properties;
                }
                else
                {
                    var properties = await _context.Property
           .Select(p => new PropertyDto
           {
               Id = p.Id,
               UserId = p.UserId,
               PropertyName = p.PropertyName,
               Type = p.Type,
               Status = p.Status,
               City = p.City,
               Country = p.Country,
               MainImage = p.Images

                            .Where(img => img.IsMain)
                            .Select(img => img.ImageUrl)
                            .FirstOrDefault()
           }).Where(p => p.UserId.ToString() == userId)
           .ToListAsync();

                    return properties;
                }

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
                var result = await _context.Property
         .Where(p => p.Id.ToString() == Id)
         .Select(p => new PropertyDto
         {
             Id = p.Id,
             UserId = p.UserId,
             PropertyName = p.PropertyName,
             Type = p.Type,
             Status = p.Status,
             City = p.City,
             Price = p.Price,
             Description = p.Description,
             Country = p.Country,
             CreatedDate = p.CreatedDate,

             MainImage = p.Images
                 .Where(img => img.IsMain)
                 .Select(img => img.ImageUrl)
                 .FirstOrDefault(),

             Allimgae = p.Images
                 .Select(img => img.ImageUrl)
                 .ToArray()
         })
         .FirstOrDefaultAsync();

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
    }
}
