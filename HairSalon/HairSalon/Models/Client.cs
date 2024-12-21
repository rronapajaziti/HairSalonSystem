using System.Text.Json.Serialization;

namespace HairSalon.Models
{
    public class Client
    {
        public int ClientID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public string? Email { get; set; }
        [JsonIgnore]
        public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();

    }
}
