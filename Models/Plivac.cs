using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using System.Text.Json.Serialization;

namespace Models
{
    [Table("Plivac")]
    public class Plivac 
    {
        [Key]
        public int ID { get; set; }

        [RegularExpression("^[0-9][0-9]{12}$"), Required]
        public string JMBG { get; set; }

        [Required]
        [MaxLength(50)]
        public string Ime { get; set; }

        [Required]
        [MaxLength(50)]
        public string Prezime { get; set; }

        [RegularExpression("Z|M")]
        public char Pol { get; set;}

        [RegularExpression("neplivac|rekreativac|takmicar")]
        [MaxLength(20)]
        [Required]
        public string NivoSpreme { get; set; }

        public DateTime DatumRodjenja { get; set; }

        [MaxLength(35)]
        public string Kontakt { get; set; }
        
        public Klub Klub { get; set; }
        public List<Ucestvuje> PlivacNaTakmicenjima { get; set; }
    }
}