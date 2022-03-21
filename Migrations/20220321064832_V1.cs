using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace PROJEKAT.Migrations
{
    public partial class V1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Discipline",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Stil = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Distanca = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Discipline", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Klubovi",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ime = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Adresa = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    BrTelefona = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Klubovi", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Takmicenja",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Rang = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Grad = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Drzava = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Datum = table.Column<DateTime>(type: "datetime2", nullable: false),
                    VelicinaBazena = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Takmicenja", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Plivac",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    JMBG = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Ime = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Prezime = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Pol = table.Column<string>(type: "nvarchar(1)", nullable: false),
                    NivoSpreme = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    DatumRodjenja = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Kontakt = table.Column<string>(type: "nvarchar(35)", maxLength: 35, nullable: true),
                    KlubID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Plivac", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Plivac_Klubovi_KlubID",
                        column: x => x.KlubID,
                        principalTable: "Klubovi",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Ucestvuje",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Rezultat = table.Column<TimeSpan>(type: "time", nullable: false),
                    Plasman = table.Column<int>(type: "int", nullable: false),
                    TakmicenjeID = table.Column<int>(type: "int", nullable: true),
                    PlivacID = table.Column<int>(type: "int", nullable: true),
                    DisciplinaID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ucestvuje", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Ucestvuje_Discipline_DisciplinaID",
                        column: x => x.DisciplinaID,
                        principalTable: "Discipline",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Ucestvuje_Plivac_PlivacID",
                        column: x => x.PlivacID,
                        principalTable: "Plivac",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Ucestvuje_Takmicenja_TakmicenjeID",
                        column: x => x.TakmicenjeID,
                        principalTable: "Takmicenja",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Plivac_KlubID",
                table: "Plivac",
                column: "KlubID");

            migrationBuilder.CreateIndex(
                name: "IX_Ucestvuje_DisciplinaID",
                table: "Ucestvuje",
                column: "DisciplinaID");

            migrationBuilder.CreateIndex(
                name: "IX_Ucestvuje_PlivacID",
                table: "Ucestvuje",
                column: "PlivacID");

            migrationBuilder.CreateIndex(
                name: "IX_Ucestvuje_TakmicenjeID",
                table: "Ucestvuje",
                column: "TakmicenjeID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Ucestvuje");

            migrationBuilder.DropTable(
                name: "Discipline");

            migrationBuilder.DropTable(
                name: "Plivac");

            migrationBuilder.DropTable(
                name: "Takmicenja");

            migrationBuilder.DropTable(
                name: "Klubovi");
        }
    }
}
