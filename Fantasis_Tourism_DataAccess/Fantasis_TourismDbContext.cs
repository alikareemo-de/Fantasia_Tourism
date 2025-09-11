using Fantasis_Tourism_DataAccess.Model;
using Microsoft.EntityFrameworkCore;

namespace Fantasis_Tourism_DataAccess
{
    public class Fantasis_TourismDbContext : DbContext
    {
        public Fantasis_TourismDbContext(DbContextOptions<Fantasis_TourismDbContext> options) : base(options) { }

        public DbSet<Users> Users { get; set; } = null!;
        public DbSet<Property> Property { get; set; }
        public DbSet<PropertyImage> PropertyImages { get; set; }
        public DbSet<PaymentMethod> PaymentMethods { get; set; }
        public DbSet<Booking> Booking { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Users>(entity =>
            {
                entity.HasKey(e => e.Id);
            });
            modelBuilder.Entity<PaymentMethod>()
            .HasOne(pm => pm.User)
            .WithMany(u => u.PaymentMethods)
            .HasForeignKey(pm => pm.UserId);
            modelBuilder.Entity<Property>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Type).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Description).IsRequired();
                entity.Property(e => e.Capacity).IsRequired();
                entity.Property(e => e.PricePerNight).HasColumnType("decimal(18,2)");
            });

            modelBuilder.Entity<PropertyImage>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.Property)
                      .WithMany(p => p.Images)
                      .HasForeignKey(e => e.PropertyId);
            });
        }
    }
}
