using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HairSalon.Migrations
{
    /// <inheritdoc />
    public partial class discountprice : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Discount",
                table: "Services");

            migrationBuilder.AddColumn<decimal>(
                name: "DiscountPrice",
                table: "Services",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DiscountPrice",
                table: "Services");

            migrationBuilder.AddColumn<decimal>(
                name: "Discount",
                table: "Services",
                type: "decimal(18,2)",
                nullable: true);
        }
    }
}
