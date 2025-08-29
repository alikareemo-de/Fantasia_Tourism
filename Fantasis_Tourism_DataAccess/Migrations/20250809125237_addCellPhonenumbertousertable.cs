using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Fantasis_Tourism_DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class addCellPhonenumbertousertable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CellPhoneNumber",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CellPhoneNumber",
                table: "Users");
        }
    }
}
