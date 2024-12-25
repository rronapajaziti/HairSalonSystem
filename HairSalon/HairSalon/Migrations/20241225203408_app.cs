using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HairSalon.Migrations
{
    /// <inheritdoc />
    public partial class app : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_Clients_ClientID",
                table: "Appointments");

            migrationBuilder.AlterColumn<int>(
                name: "ClientID",
                table: "Appointments",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_Clients_ClientID",
                table: "Appointments",
                column: "ClientID",
                principalTable: "Clients",
                principalColumn: "ClientID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_Clients_ClientID",
                table: "Appointments");

            migrationBuilder.AlterColumn<int>(
                name: "ClientID",
                table: "Appointments",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_Clients_ClientID",
                table: "Appointments",
                column: "ClientID",
                principalTable: "Clients",
                principalColumn: "ClientID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
