﻿// <auto-generated />
using System;
using HairSalon.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace HairSalon.Migrations
{
    [DbContext(typeof(MyContext))]
    [Migration("20250103194015_discountprice")]
    partial class discountprice
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.0")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("DailyExpense", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<double>("Amount")
                        .HasColumnType("float");

                    b.Property<DateTime>("Date")
                        .HasColumnType("datetime2");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("DailyExpenses");
                });

            modelBuilder.Entity("HairSalon.Models.Appointment", b =>
                {
                    b.Property<int>("AppointmentID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("AppointmentID"));

                    b.Property<DateTime>("AppointmentDate")
                        .HasColumnType("datetime2");

                    b.Property<int?>("ClientID")
                        .HasColumnType("int");

                    b.Property<string>("Notes")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("ServiceID")
                        .HasColumnType("int");

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("UserID")
                        .HasColumnType("int");

                    b.HasKey("AppointmentID");

                    b.HasIndex("ClientID");

                    b.HasIndex("ServiceID");

                    b.HasIndex("UserID");

                    b.ToTable("Appointments");
                });

            modelBuilder.Entity("HairSalon.Models.Client", b =>
                {
                    b.Property<int>("ClientID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ClientID"));

                    b.Property<string>("Email")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PhoneNumber")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("ClientID");

                    b.ToTable("Clients");
                });

            modelBuilder.Entity("HairSalon.Models.Role", b =>
                {
                    b.Property<int>("RoleID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("RoleID"));

                    b.Property<string>("RoleName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("RoleID");

                    b.ToTable("Roles");

                    b.HasData(
                        new
                        {
                            RoleID = 1,
                            RoleName = "Admin"
                        },
                        new
                        {
                            RoleID = 2,
                            RoleName = "Owner"
                        },
                        new
                        {
                            RoleID = 3,
                            RoleName = "Staff"
                        });
                });

            modelBuilder.Entity("HairSalon.Models.Service", b =>
                {
                    b.Property<int>("ServiceID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ServiceID"));

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<decimal>("DiscountPrice")
                        .HasColumnType("decimal(18,2)");

                    b.Property<int?>("Duration")
                        .HasColumnType("int");

                    b.Property<decimal>("Price")
                        .HasColumnType("decimal(18,2)");

                    b.Property<string>("ServiceName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<decimal>("StaffEarningPercentage")
                        .HasColumnType("decimal(18,2)");

                    b.HasKey("ServiceID");

                    b.ToTable("Services");
                });

            modelBuilder.Entity("HairSalon.Models.ServiceDiscount", b =>
                {
                    b.Property<int>("ServiceDiscountID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ServiceDiscountID"));

                    b.Property<decimal>("DiscountPercentage")
                        .HasColumnType("decimal(18,2)");

                    b.Property<DateTime>("EndDate")
                        .HasColumnType("datetime2");

                    b.Property<int>("ServiceID")
                        .HasColumnType("int");

                    b.Property<int?>("ServiceID1")
                        .HasColumnType("int");

                    b.Property<DateTime>("StartDate")
                        .HasColumnType("datetime2");

                    b.HasKey("ServiceDiscountID");

                    b.HasIndex("ServiceID");

                    b.HasIndex("ServiceID1");

                    b.ToTable("ServiceDiscounts");
                });

            modelBuilder.Entity("HairSalon.Models.ServiceStaff", b =>
                {
                    b.Property<int>("ServiceStaffID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ServiceStaffID"));

                    b.Property<int?>("AppointmentID")
                        .HasColumnType("int");

                    b.Property<DateTime>("DateCompleted")
                        .HasColumnType("datetime2");

                    b.Property<decimal>("Price")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");

                    b.Property<int>("ServiceID")
                        .HasColumnType("int");

                    b.Property<decimal>("StaffEarning")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");

                    b.Property<int>("StaffID")
                        .HasColumnType("int");

                    b.HasKey("ServiceStaffID");

                    b.HasIndex("AppointmentID");

                    b.HasIndex("ServiceID");

                    b.HasIndex("StaffID");

                    b.ToTable("ServiceStaff");
                });

            modelBuilder.Entity("HairSalon.Models.User", b =>
                {
                    b.Property<int>("UserID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("UserID"));

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("PasswordHash")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("PasswordSalt")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PhoneNumber")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("RoleID")
                        .HasColumnType("int");

                    b.HasKey("UserID");

                    b.HasIndex("RoleID");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("MonthlyExpenses", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<double>("Amount")
                        .HasColumnType("float");

                    b.Property<DateTime>("Date")
                        .HasColumnType("datetime2");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("MonthlyExpenses");
                });

            modelBuilder.Entity("HairSalon.Models.Appointment", b =>
                {
                    b.HasOne("HairSalon.Models.Client", "Client")
                        .WithMany("Appointments")
                        .HasForeignKey("ClientID");

                    b.HasOne("HairSalon.Models.Service", "Service")
                        .WithMany()
                        .HasForeignKey("ServiceID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("HairSalon.Models.User", "User")
                        .WithMany("Appointments")
                        .HasForeignKey("UserID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Client");

                    b.Navigation("Service");

                    b.Navigation("User");
                });

            modelBuilder.Entity("HairSalon.Models.ServiceDiscount", b =>
                {
                    b.HasOne("HairSalon.Models.Service", "Service")
                        .WithMany()
                        .HasForeignKey("ServiceID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("HairSalon.Models.Service", null)
                        .WithMany("ServiceDiscounts")
                        .HasForeignKey("ServiceID1");

                    b.Navigation("Service");
                });

            modelBuilder.Entity("HairSalon.Models.ServiceStaff", b =>
                {
                    b.HasOne("HairSalon.Models.Appointment", null)
                        .WithMany("ServiceStaff")
                        .HasForeignKey("AppointmentID");

                    b.HasOne("HairSalon.Models.Service", "Service")
                        .WithMany("ServiceStaff")
                        .HasForeignKey("ServiceID")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("HairSalon.Models.User", "User")
                        .WithMany("ServiceStaff")
                        .HasForeignKey("StaffID")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Service");

                    b.Navigation("User");
                });

            modelBuilder.Entity("HairSalon.Models.User", b =>
                {
                    b.HasOne("HairSalon.Models.Role", null)
                        .WithMany("Users")
                        .HasForeignKey("RoleID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("HairSalon.Models.Appointment", b =>
                {
                    b.Navigation("ServiceStaff");
                });

            modelBuilder.Entity("HairSalon.Models.Client", b =>
                {
                    b.Navigation("Appointments");
                });

            modelBuilder.Entity("HairSalon.Models.Role", b =>
                {
                    b.Navigation("Users");
                });

            modelBuilder.Entity("HairSalon.Models.Service", b =>
                {
                    b.Navigation("ServiceDiscounts");

                    b.Navigation("ServiceStaff");
                });

            modelBuilder.Entity("HairSalon.Models.User", b =>
                {
                    b.Navigation("Appointments");

                    b.Navigation("ServiceStaff");
                });
#pragma warning restore 612, 618
        }
    }
}
