using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Fantasis_Tourism_DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class addstauts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "status",
                table: "Booking",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "status",
                table: "Booking");
        }
    }
}
