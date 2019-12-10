using Microsoft.EntityFrameworkCore;
using System;

namespace WaterMango.Data.Entities
{
    public class WaterMangoContext : DbContext
    {
        public WaterMangoContext(DbContextOptions<WaterMangoContext> options)
            : base(options)
        {
        }

        public DbSet<Plant> Plants { get; set; }

        // Seed data for demo purposes
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Plant>().HasData(
                new Plant
                {
                    PlantId = 1,
                    Name = "Mint",
                    LastWateredDate = DateTime.Now
                },
                new Plant
                {
                    PlantId = 2,
                    Name = "Aloe",
                    LastWateredDate = DateTime.Now.AddHours(-3)
                },
                new Plant
                {
                    PlantId = 3,
                    Name = "Cacti",
                    LastWateredDate = DateTime.Now.AddHours(-11) // overdue
                },
                new Plant
                {
                    PlantId = 4,
                    Name = "Peace Lily",
                    LastWateredDate = null // not watered at all
                },
                new Plant
                {
                    PlantId = 5,
                    Name = "Catnip",
                    LastWateredDate = DateTime.Now.AddHours(-5).AddMinutes(-59).AddSeconds(-30) // Almost 6 hours
                });

            base.OnModelCreating(modelBuilder);
        }
    }
}
