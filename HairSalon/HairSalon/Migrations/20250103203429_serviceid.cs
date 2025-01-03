using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HairSalon.Migrations
{
    /// <inheritdoc />
    public partial class serviceid : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ServiceDiscounts_Services_ServiceID",
                table: "ServiceDiscounts");

            migrationBuilder.DropForeignKey(
                name: "FK_ServiceDiscounts_Services_ServiceID1",
                table: "ServiceDiscounts");

            migrationBuilder.DropIndex(
                name: "IX_ServiceDiscounts_ServiceID",
                table: "ServiceDiscounts");

            migrationBuilder.DropIndex(
                name: "IX_ServiceDiscounts_ServiceID1",
                table: "ServiceDiscounts");

            migrationBuilder.DropColumn(
                name: "ServiceID",
                table: "ServiceDiscounts");

            migrationBuilder.DropColumn(
                name: "ServiceID1",
                table: "ServiceDiscounts");

            migrationBuilder.AddColumn<string>(
                name: "ServiceIDs",
                table: "ServiceDiscounts",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "[]");

            migrationBuilder.CreateTable(
                name: "ServiceServiceDiscount",
                columns: table => new
                {
                    ServiceDiscountID = table.Column<int>(type: "int", nullable: false),
                    ServiceID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServiceServiceDiscount", x => new { x.ServiceDiscountID, x.ServiceID });
                    table.ForeignKey(
                        name: "FK_ServiceServiceDiscount_ServiceDiscounts_ServiceDiscountID",
                        column: x => x.ServiceDiscountID,
                        principalTable: "ServiceDiscounts",
                        principalColumn: "ServiceDiscountID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ServiceServiceDiscount_Services_ServiceID",
                        column: x => x.ServiceID,
                        principalTable: "Services",
                        principalColumn: "ServiceID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ServiceServiceDiscount_ServiceID",
                table: "ServiceServiceDiscount",
                column: "ServiceID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ServiceServiceDiscount");

            migrationBuilder.DropColumn(
                name: "ServiceIDs",
                table: "ServiceDiscounts");

            migrationBuilder.AddColumn<int>(
                name: "ServiceID",
                table: "ServiceDiscounts",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ServiceID1",
                table: "ServiceDiscounts",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ServiceDiscounts_ServiceID",
                table: "ServiceDiscounts",
                column: "ServiceID");

            migrationBuilder.CreateIndex(
                name: "IX_ServiceDiscounts_ServiceID1",
                table: "ServiceDiscounts",
                column: "ServiceID1");

            migrationBuilder.AddForeignKey(
                name: "FK_ServiceDiscounts_Services_ServiceID",
                table: "ServiceDiscounts",
                column: "ServiceID",
                principalTable: "Services",
                principalColumn: "ServiceID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ServiceDiscounts_Services_ServiceID1",
                table: "ServiceDiscounts",
                column: "ServiceID1",
                principalTable: "Services",
                principalColumn: "ServiceID");
        }
    }
}
