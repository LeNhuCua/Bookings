using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Entities.BaseEntities;


namespace Entities.Models
{
    [Table("Ages")]
    public class Age : BaseEntity
    {
        [Required]
        [StringLength(50)]
        [Display(Name = "Độ tuổi", Prompt = "Độ tuổi")]
        public string Name { set; get; }

        [Display(Name = "Người lớn")]
        public bool IsAdult { set; get; }

    }
}
