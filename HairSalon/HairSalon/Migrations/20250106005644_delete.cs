using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HairSalon.Migrations
{
    /// <inheritdoc />
    public partial class delete : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ServiceStaff_Users_StaffID",
                table: "ServiceStaff");

            migrationBuilder.AddColumn<int>(
                name: "UserID",
                table: "ServiceStaff",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ServiceStaff_UserID",
                table: "ServiceStaff",
                column: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_ServiceStaff_Users_StaffID",
                table: "ServiceStaff",
                column: "StaffID",
                principalTable: "Users",
                principalColumn: "UserID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ServiceStaff_Users_UserID",
                table: "ServiceStaff",
                column: "UserID",
                principalTable: "Users",
                principalColumn: "UserID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ServiceStaff_Users_StaffID",
                table: "ServiceStaff");

            migrationBuilder.DropForeignKey(
                name: "FK_ServiceStaff_Users_UserID",
                table: "ServiceStaff");

            migrationBuilder.DropIndex(
                name: "IX_ServiceStaff_UserID",
                table: "ServiceStaff");

            migrationBuilder.DropColumn(
                name: "UserID",
                table: "ServiceStaff");

            migrationBuilder.AddForeignKey(
                name: "FK_ServiceStaff_Users_StaffID",
                table: "ServiceStaff",
                column: "StaffID",
                principalTable: "Users",
                principalColumn: "UserID",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
