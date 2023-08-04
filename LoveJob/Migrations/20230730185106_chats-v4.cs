using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LoveJob.Migrations
{
    /// <inheritdoc />
    public partial class chatsv4 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Name1",
                table: "chats",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Name2",
                table: "chats",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name1",
                table: "chats");

            migrationBuilder.DropColumn(
                name: "Name2",
                table: "chats");
        }
    }
}
