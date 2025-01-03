using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HairSalon.Migrations
{
    /// <inheritdoc />
    public partial class PriceService : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ServiceID1",
                table: "ServiceDiscounts",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ServiceDiscounts_ServiceID1",
                table: "ServiceDiscounts",
                column: "ServiceID1");

            migrationBuilder.AddForeignKey(
                name: "FK_ServiceDiscounts_Services_ServiceID1",
                table: "ServiceDiscounts",
                column: "ServiceID1",
                principalTable: "Services",
                principalColumn: "ServiceID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ServiceDiscounts_Services_ServiceID1",
                table: "ServiceDiscounts");

            migrationBuilder.DropIndex(
                name: "IX_ServiceDiscounts_ServiceID1",
                table: "ServiceDiscounts");

            migrationBuilder.DropColumn(
                name: "ServiceID1",
                table: "ServiceDiscounts");
        }
    }
}
