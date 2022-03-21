using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Models
{
    public class Disciplina
    {
        [Key]
        public int ID { get; set; }

        [Required]
        [MaxLength(50)]
        [RegularExpression("kraul|prsno|ledjno|delfin")]
        public string Stil { get; set; }   

        [Required]
        [Range(50,1500)] 
        public int Distanca { get; set; }

        [JsonIgnore]
        public List<Ucestvuje> DisciplinaNaTakmicenjima { get; set; }
    }
}