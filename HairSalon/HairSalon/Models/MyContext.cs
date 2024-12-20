﻿using Microsoft.EntityFrameworkCore;

namespace HairSalon.Models
{
    public class MyContext : DbContext
    {
        public MyContext(DbContextOptions<MyContext> options) : base(options)
        {
        }

        public DbSet<Client> Clients { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<ServiceStaff> ServiceStaff { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Role>().HasData(
                new Role { RoleID = 1, RoleName = "Admin" },
                new Role { RoleID = 2, RoleName = "Owner" },
                new Role { RoleID = 3, RoleName = "Staff" }
            );

            modelBuilder.Entity<ServiceStaff>()
                .HasOne(ss => ss.User)
                .WithMany(u => u.ServiceStaff) 
                .HasForeignKey(ss => ss.UserID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ServiceStaff>()
                .HasOne(ss => ss.Service)
                .WithMany(s => s.ServiceStaff) 
                .HasForeignKey(ss => ss.ServiceID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ServiceStaff>()
                .HasOne(ss => ss.Appointment)
                .WithMany(a => a.ServiceStaff) 
                .HasForeignKey(ss => ss.AppointmentID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ServiceStaff>()
                .Property(ss => ss.AmountEarned)
                .HasPrecision(18, 2);
        }
    }
}
