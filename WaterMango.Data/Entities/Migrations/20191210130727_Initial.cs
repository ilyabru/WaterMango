using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace WaterMango.Data.Migrations
{
    public partial class Initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Plants",
                columns: table => new
                {
                    PlantId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(maxLength: 150, nullable: false),
                    LastWateredDate = table.Column<DateTime>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Plants", x => x.PlantId);
                });

            migrationBuilder.InsertData(
                table: "Plants",
                columns: new[] { "PlantId", "LastWateredDate", "Name" },
                values: new object[,]
                {
                    { 1, new DateTime(2019, 12, 10, 8, 7, 26, 929, DateTimeKind.Local).AddTicks(2116), "Mint" },
                    { 2, new DateTime(2019, 12, 10, 5, 7, 26, 932, DateTimeKind.Local).AddTicks(9304), "Aloe" },
                    { 3, new DateTime(2019, 12, 9, 21, 7, 26, 932, DateTimeKind.Local).AddTicks(9376), "Cacti" },
                    { 4, null, "Peace Lily" },
                    { 5, new DateTime(2019, 12, 10, 2, 7, 56, 932, DateTimeKind.Local).AddTicks(9381), "Catnip" }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Plants");
        }
    }
}
