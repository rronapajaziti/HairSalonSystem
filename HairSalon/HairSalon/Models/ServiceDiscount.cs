using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace HairSalon.Models
{
    public class ServiceDiscount
    {
        public int ServiceDiscountID { get; set; }

        [Required]
        public ICollection<int> ServiceIDs { get; set; } = new List<int>();

        [Required]
        [DataType(DataType.Date)]
        public DateTime StartDate { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime EndDate { get; set; }

        public decimal DiscountPercentage { get; set; }

        [JsonIgnore]
        public ICollection<Service> Services { get; set; } = new List<Service>();
    }
}
