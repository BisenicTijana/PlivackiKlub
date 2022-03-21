using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using System.Text.Json.Serialization;

namespace Models
{
    public class Klub 
    {
        [Key]
        public int ID { get; set; }

        [Required, MaxLength(50)]
        public string Ime { get; set; }

        [MaxLength(50)]
        public string Adresa { get; set; }

    
        [MaxLength(30)]
        public string Email { get; set; }

        [MaxLength(15)]
        public string  BrTelefona { get; set; }

        [JsonIgnore]
        public List<Plivac> ListaPlivaca { get; set; }


    }

}