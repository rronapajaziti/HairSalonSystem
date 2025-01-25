using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HairSalon.Models
{
    public class ServiceStaff
    {
        [Key]
        public int ServiceStaffID { get; set; }

        [ForeignKey("Service")]
        public int ServiceID { get; set; }
        public virtual Service Service { get; set; }

        [ForeignKey("User")]
        public int UserID { get; set; }
        public virtual User User { get; set; }

        [Required]
        public DateTime DateCompleted { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal StaffEarning { get; set; }
    }
}
