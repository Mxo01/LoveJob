﻿using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LoveJob.Migrations
{
    /// <inheritdoc />
    public partial class chatsv5 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "LastMessage",
                table: "chats",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "Time",
                table: "chats",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastMessage",
                table: "chats");

            migrationBuilder.DropColumn(
                name: "Time",
                table: "chats");
        }
    }
}
