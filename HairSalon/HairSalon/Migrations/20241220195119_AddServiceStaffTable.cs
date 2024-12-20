using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HairSalon.Migrations
{
    /// <inheritdoc />
    public partial class AddServiceStaffTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ServiceStaff",
                columns: table => new
                {
                    ServiceStaffID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserID = table.Column<int>(nullable: false),
                    ServiceID = table.Column<int>(nullable: false),
                    AppointmentID = table.Column<int>(nullable: false),
                    Percentage = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    AmountEarned = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    DateProvided = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServiceStaff", x => x.ServiceStaffID);
                    table.ForeignKey(
                        name: "FK_ServiceStaff_Users_UserID",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ServiceStaff_Services_ServiceID",
                        column: x => x.ServiceID,
                        principalTable: "Services",
                        principalColumn: "ServiceID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ServiceStaff_Appointments_AppointmentID",
                        column: x => x.AppointmentID,
                        principalTable: "Appointments",
                        principalColumn: "AppointmentID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ServiceStaff_UserID",
                table: "ServiceStaff",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_ServiceStaff_ServiceID",
                table: "ServiceStaff",
                column: "ServiceID");

            migrationBuilder.CreateIndex(
                name: "IX_ServiceStaff_AppointmentID",
                table: "ServiceStaff",
                column: "AppointmentID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ServiceStaff");
        }
    }
}
