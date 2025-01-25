using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HairSalon.Migrations
{
    /// <inheritdoc />
    public partial class userid : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ServiceStaff_Users_StaffID",
                table: "ServiceStaff");

            migrationBuilder.DropForeignKey(
                name: "FK_ServiceStaff_Users_UserID",
                table: "ServiceStaff");

            migrationBuilder.DropIndex(
                name: "IX_ServiceStaff_StaffID",
                table: "ServiceStaff");

            migrationBuilder.DropColumn(
                name: "StaffID",
                table: "ServiceStaff");

            migrationBuilder.AlterColumn<int>(
                name: "UserID",
                table: "ServiceStaff",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ServiceStaff_Users_UserID",
                table: "ServiceStaff",
                column: "UserID",
                principalTable: "Users",
                principalColumn: "UserID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ServiceStaff_Users_UserID",
                table: "ServiceStaff");

            migrationBuilder.AlterColumn<int>(
                name: "UserID",
                table: "ServiceStaff",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "StaffID",
                table: "ServiceStaff",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_ServiceStaff_StaffID",
                table: "ServiceStaff",
                column: "StaffID");

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
    }
}
