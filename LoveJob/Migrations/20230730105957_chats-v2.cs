using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LoveJob.Migrations
{
    /// <inheritdoc />
    public partial class chatsv2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "user2",
                table: "chats",
                newName: "User2");

            migrationBuilder.RenameColumn(
                name: "user1",
                table: "chats",
                newName: "User1");

            migrationBuilder.AddColumn<string>(
                name: "Id",
                table: "messages",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Id",
                table: "chats",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Id",
                table: "messages");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "chats");

            migrationBuilder.RenameColumn(
                name: "User2",
                table: "chats",
                newName: "user2");

            migrationBuilder.RenameColumn(
                name: "User1",
                table: "chats",
                newName: "user1");
        }
    }
}
