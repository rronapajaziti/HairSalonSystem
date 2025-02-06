using System.Text.Json.Serialization;

namespace HairSalon.Models
{
    public class AppointmentService
    {
        public int AppointmentServiceID { get; set; }

        // Foreign key to Appointment
        public int AppointmentID { get; set; }
        [JsonIgnore]
        public Appointment Appointment { get; set; }

        // Foreign key to Service
        public int ServiceID { get; set; }
        public Service Service { get; set; }

    }
}
