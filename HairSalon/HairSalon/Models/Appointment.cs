using System.Text.Json.Serialization;

namespace HairSalon.Models
{
    public class Appointment
    {
        public int AppointmentID { get; set; }
        public int? ClientID { get; set; }
        [JsonIgnore]
        public Client Client { get; set; }
        public int UserID { get; set; }
        [JsonIgnore]
        public User? User { get; set; }
        public int ServiceID { get; set; }
        [JsonIgnore]
        public Service? Service { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string Status { get; set; }
        public string? Notes { get; set; }

        [JsonIgnore]
        public ICollection<ServiceStaff> ServiceStaff { get; set; } = new List<ServiceStaff>(); 

    }
}
