using Microsoft.EntityFrameworkCore;

namespace Models
{
    public class PlivackiKlubContext : DbContext
    {
        public DbSet<Plivac> Plivaci { get; set; }
        public DbSet<Disciplina> Discipline {get; set; }
        public DbSet<Takmicenje> Takmicenja { get; set; }
        public DbSet<Ucestvuje> Ucestvuje { get; set; }
        public DbSet<Klub> Klubovi { get; set; }
        //public DbSet<TakmicenjaUKlubu> TakmicenjaUKlubovima{ get; set; }
        public PlivackiKlubContext(DbContextOptions options): base(options){}

    }
}