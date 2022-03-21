using System;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using System.Text.Json.Serialization;

namespace Models
{
    public class Ucestvuje
    {
        [Key]
        public int ID { get; set; }
        public TimeSpan Rezultat { get; set; } 
       // public string Rezultat { get; set; }
        public int Plasman { get; set; }
        [JsonIgnore]
        public Takmicenje Takmicenje { get; set; }

        [JsonIgnore]
        public Plivac Plivac { get; set; }
        [JsonIgnore]
        public Disciplina Disciplina { get; set; }
        
    }
}