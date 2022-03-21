using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Models
{
    public class Takmicenje
    {
        [Key]
        public int ID { get; set; }

        [MaxLength(50)]
        [RegularExpression("Miting|Drzavno|Medjunarodno")]
        public string Rang { get; set; }

        [MaxLength(50)]
        public string Grad { get; set; }

        [MaxLength(50)]
        public string Drzava { get; set; }

        [Required]
        public DateTime Datum { get; set; }
        public int VelicinaBazena { get; set; }
        
        [JsonIgnore]
        public List<Ucestvuje> PlivaciUcestvuju { get; set; } 


   
    }
}