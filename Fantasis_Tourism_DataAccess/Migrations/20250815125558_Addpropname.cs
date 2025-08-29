using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Fantasis_Tourism_DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class Addpropname : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PropertyImage_Property_PropertyId",
                table: "PropertyImage");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PropertyImage",
                table: "PropertyImage");

            migrationBuilder.RenameTable(
                name: "PropertyImage",
                newName: "PropertyImages");

            migrationBuilder.RenameIndex(
                name: "IX_PropertyImage_PropertyId",
                table: "PropertyImages",
                newName: "IX_PropertyImages_PropertyId");

            migrationBuilder.AddColumn<string>(
                name: "PropertyName",
                table: "Property",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PropertyImages",
                table: "PropertyImages",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PropertyImages_Property_PropertyId",
                table: "PropertyImages",
                column: "PropertyId",
                principalTable: "Property",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PropertyImages_Property_PropertyId",
                table: "PropertyImages");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PropertyImages",
                table: "PropertyImages");

            migrationBuilder.DropColumn(
                name: "PropertyName",
                table: "Property");

            migrationBuilder.RenameTable(
                name: "PropertyImages",
                newName: "PropertyImage");

            migrationBuilder.RenameIndex(
                name: "IX_PropertyImages_PropertyId",
                table: "PropertyImage",
                newName: "IX_PropertyImage_PropertyId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PropertyImage",
                table: "PropertyImage",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PropertyImage_Property_PropertyId",
                table: "PropertyImage",
                column: "PropertyId",
                principalTable: "Property",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
