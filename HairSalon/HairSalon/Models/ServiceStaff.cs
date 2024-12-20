using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace HairSalon.Models
{
    public class ServiceStaff
    {
        [Key]
        public int ServiceStaffID { get; set; }

        [ForeignKey("StaffID")]
        public int UserID { get; set; }
        [JsonIgnore]
        public User User { get; set; }

        [ForeignKey("Service")]
        public int ServiceID { get; set; }

        public Service Service { get; set; }

        [ForeignKey("Appointment")]
        public int AppointmentID { get; set; }
        public Appointment Appointment { get; set; }

        [Required]
        [Range(0, 100)]
        public decimal Percentage { get; set; }

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal AmountEarned { get; set; }

        [Required]
        public DateTime DateProvided { get; set; }
    }
}
