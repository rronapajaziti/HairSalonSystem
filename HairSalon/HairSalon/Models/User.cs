using HairSalon.Migrations;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace HairSalon.Models
{
    public class User
    {
        public int UserID { get; set; }
        [Required(ErrorMessage = "First name is required.")]
        [StringLength(50, ErrorMessage = "First name cannot exceed 50 characters.")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "Last name is required.")]
        [StringLength(50, ErrorMessage = "Last name cannot exceed 50 characters.")]
        public string LastName { get; set; }

        [Required(ErrorMessage = "Phone number is required.")]
        [Phone(ErrorMessage = "Invalid phone number format.")]
        public string PhoneNumber { get; set; }

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password is required.")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters long.")]
        public string PasswordHash { get; set; }
        public string PasswordSalt { get; set; }
        [ForeignKey("Roles")]
        public int RoleID { get; set; }

        public User()
        {
            RoleID = 3; 
        }

        [JsonIgnore]
        public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
        [JsonIgnore]
        public ICollection<ServiceStaff> ServiceStaff { get; set; } = new List<ServiceStaff>();

        [NotMapped]
        public bool IsStaff => RoleID == 3;
        public string? RefreshToken { get; set; }

    }
}
