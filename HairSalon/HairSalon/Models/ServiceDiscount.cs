using System.Text.Json.Serialization;

namespace HairSalon.Models
{
    public class ServiceDiscount
    {
        public int ServiceDiscountID{ get; set; }
        public int ServiceID { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal DiscountPercentage { get; set; }
        
        
        [JsonIgnore] 
        public Service? Service { get; set; }
    }
}
