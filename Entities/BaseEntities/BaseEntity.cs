using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Entities.Models;

namespace Entities.BaseEntities
{
    public abstract class BaseEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { set; get; }
        [Required]
        public DateTime DateCreated { set; get; }

        [Required]
        public DateTime LastUpdated { set; get; }

        public DateTime? DateDeleted { get; set; }

        [Required]
        public int CreatedBy { set; get; }

        [Required]
        public int UpdatedBy { set; get; }

        public int? DeletedBy { set; get; }

        [Required]
        public bool IsDelete { set; get; }

        [Required]
        public bool Status { set; get; }

    }
}
