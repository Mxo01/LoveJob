﻿// <auto-generated />
using System;
using LoveJob.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace LoveJob.Migrations
{
    [DbContext(typeof(UsersDbContext))]
    partial class UsersDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.8")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("LoveJob.Models.Chat", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("LastMessage")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name1")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name2")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("Time")
                        .HasColumnType("datetime2");

                    b.Property<string>("User1")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("User2")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("chats", (string)null);
                });

            modelBuilder.Entity("LoveJob.Models.Favorite", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("By")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("City")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("CompanyName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Owner")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Position")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Salary")
                        .HasColumnType("int");

                    b.Property<string>("State")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("favorites", (string)null);
                });

            modelBuilder.Entity("LoveJob.Models.FeedBack", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("FeedBackText")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Time")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Title")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("feedbacks", (string)null);
                });

            modelBuilder.Entity("LoveJob.Models.Marker", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("By")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("City")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("CompanyName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<float>("Lat")
                        .HasColumnType("real");

                    b.Property<float>("Lng")
                        .HasColumnType("real");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Position")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Salary")
                        .HasColumnType("int");

                    b.Property<string>("State")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("markers", (string)null);
                });

            modelBuilder.Entity("LoveJob.Models.Message", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Body")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("DateTime")
                        .HasColumnType("datetime2");

                    b.Property<string>("Receiver")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Sender")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("messages", (string)null);
                });

            modelBuilder.Entity("LoveJob.Models.User", b =>
                {
                    b.Property<string>("Username")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("CompanyName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Email")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("FirstName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("LastName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Password")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Position")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("RefreshToken")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("RefreshTokenExpiry")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("ResetPasswordExpiry")
                        .HasColumnType("datetime2");

                    b.Property<string>("ResetPasswordToken")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Role")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Token")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Username");

                    b.ToTable("users", (string)null);
                });
#pragma warning restore 612, 618
        }
    }
}
