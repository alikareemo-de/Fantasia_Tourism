using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Fantasis_Tourism_DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class Addpropimagedetalis : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Url",
                table: "PropertyImages",
                newName: "ImageUrl");

            migrationBuilder.RenameColumn(
                name: "FileName",
                table: "PropertyImages",
                newName: "ImageName");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ImageUrl",
                table: "PropertyImages",
                newName: "Url");

            migrationBuilder.RenameColumn(
                name: "ImageName",
                table: "PropertyImages",
                newName: "FileName");
        }
    }
}
