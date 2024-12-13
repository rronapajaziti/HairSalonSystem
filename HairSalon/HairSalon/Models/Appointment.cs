namespace HairSalon.Models
{
    public class Appointment
    {
        public int AppointmentID { get; set; }
        public int ClientID { get; set; }
        public Client Client { get; set; }
        public int UserID { get; set; }
        public User User { get; set; }
        public int ServiceID { get; set; }
        public Service Service { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string Status { get; set; }
    }
}
