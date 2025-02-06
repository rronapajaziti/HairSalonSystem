using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HairSalon.Migrations
{
    /// <inheritdoc />
    public partial class AppointmentService : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_Services_ServiceID",
                table: "Appointments");

            migrationBuilder.DropIndex(
                name: "IX_Appointments_ServiceID",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "ServiceID",
                table: "Appointments");

            migrationBuilder.CreateTable(
                name: "AppointmentServices",
                columns: table => new
                {
                    AppointmentServiceID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AppointmentID = table.Column<int>(type: "int", nullable: false),
                    ServiceID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppointmentServices", x => x.AppointmentServiceID);
                    table.ForeignKey(
                        name: "FK_AppointmentServices_Appointments_AppointmentID",
                        column: x => x.AppointmentID,
                        principalTable: "Appointments",
                        principalColumn: "AppointmentID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AppointmentServices_Services_ServiceID",
                        column: x => x.ServiceID,
                        principalTable: "Services",
                        principalColumn: "ServiceID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppointmentServices_AppointmentID",
                table: "AppointmentServices",
                column: "AppointmentID");

            migrationBuilder.CreateIndex(
                name: "IX_AppointmentServices_ServiceID",
                table: "AppointmentServices",
                column: "ServiceID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppointmentServices");

            migrationBuilder.AddColumn<int>(
                name: "ServiceID",
                table: "Appointments",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_ServiceID",
                table: "Appointments",
                column: "ServiceID");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_Services_ServiceID",
                table: "Appointments",
                column: "ServiceID",
                principalTable: "Services",
                principalColumn: "ServiceID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
