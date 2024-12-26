using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HairSalon.Migrations
{
    /// <inheritdoc />
    public partial class staffearnings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ServiceStaff_Appointments_AppointmentID",
                table: "ServiceStaff");

            migrationBuilder.DropForeignKey(
                name: "FK_ServiceStaff_Users_UserID",
                table: "ServiceStaff");

            migrationBuilder.DropColumn(
                name: "AmountEarned",
                table: "ServiceStaff");

            migrationBuilder.DropColumn(
                name: "Percentage",
                table: "ServiceStaff");

            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "ServiceStaff",
                newName: "StaffID");

            migrationBuilder.RenameColumn(
                name: "DateProvided",
                table: "ServiceStaff",
                newName: "DateCompleted");

            migrationBuilder.RenameIndex(
                name: "IX_ServiceStaff_UserID",
                table: "ServiceStaff",
                newName: "IX_ServiceStaff_StaffID");

            migrationBuilder.AlterColumn<int>(
                name: "AppointmentID",
                table: "ServiceStaff",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<decimal>(
                name: "Price",
                table: "ServiceStaff",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "StaffEarning",
                table: "ServiceStaff",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "StaffEarningPercentage",
                table: "Services",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AlterColumn<string>(
                name: "Notes",
                table: "Appointments",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddForeignKey(
                name: "FK_ServiceStaff_Appointments_AppointmentID",
                table: "ServiceStaff",
                column: "AppointmentID",
                principalTable: "Appointments",
                principalColumn: "AppointmentID");

            migrationBuilder.AddForeignKey(
                name: "FK_ServiceStaff_Users_StaffID",
                table: "ServiceStaff",
                column: "StaffID",
                principalTable: "Users",
                principalColumn: "UserID",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ServiceStaff_Appointments_AppointmentID",
                table: "ServiceStaff");

            migrationBuilder.DropForeignKey(
                name: "FK_ServiceStaff_Users_StaffID",
                table: "ServiceStaff");

            migrationBuilder.DropColumn(
                name: "Price",
                table: "ServiceStaff");

            migrationBuilder.DropColumn(
                name: "StaffEarning",
                table: "ServiceStaff");

            migrationBuilder.DropColumn(
                name: "StaffEarningPercentage",
                table: "Services");

            migrationBuilder.RenameColumn(
                name: "StaffID",
                table: "ServiceStaff",
                newName: "UserID");

            migrationBuilder.RenameColumn(
                name: "DateCompleted",
                table: "ServiceStaff",
                newName: "DateProvided");

            migrationBuilder.RenameIndex(
                name: "IX_ServiceStaff_StaffID",
                table: "ServiceStaff",
                newName: "IX_ServiceStaff_UserID");

            migrationBuilder.AlterColumn<int>(
                name: "AppointmentID",
                table: "ServiceStaff",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "AmountEarned",
                table: "ServiceStaff",
                type: "decimal(10,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "Percentage",
                table: "ServiceStaff",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AlterColumn<string>(
                name: "Notes",
                table: "Appointments",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ServiceStaff_Appointments_AppointmentID",
                table: "ServiceStaff",
                column: "AppointmentID",
                principalTable: "Appointments",
                principalColumn: "AppointmentID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ServiceStaff_Users_UserID",
                table: "ServiceStaff",
                column: "UserID",
                principalTable: "Users",
                principalColumn: "UserID",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
