﻿namespace HairSalon.Models
{
    public class User
    {
        public int UserID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public int RoleID { get; set; }

        public ICollection<Appointment> Appointments { get; set; }
    }
}
