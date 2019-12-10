using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace WaterMango.Data.Entities
{
    public class Plant : IValidatableObject
    {
        [Key]
        public int PlantId { get; set; }

        [Required]
        [MaxLength(150)]
        public string Name { get; set; }

        public DateTime? LastWateredDate { get; set; }

        // validation rule that checks if 30 seconds has passed since last water date and time
        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            int interval = 30;

            if (LastWateredDate.HasValue)
            {
                var diffInSeconds = (DateTime.Now - LastWateredDate.Value).TotalSeconds;
                if (diffInSeconds < interval)
                {
                    yield return new ValidationResult(
                        $"Plants can only be watered every {interval} seconds. Please wait {interval - diffInSeconds} more seconds.",
                        new[] { nameof(LastWateredDate) });
                }
            }
        }
    }
}
