using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Entities.BaseEntities;

namespace Entities.Models
{
    [Table("Provinces")]
    public class Province : BaseEntity
    {
        [Key]
        public int ID { set; get; }

        [Required]
        [StringLength(50)]
        public string Name { set; get; }

        public virtual IEnumerable<Customer> Customers { get; set; }

        public virtual IEnumerable<User> Users { get; set; }
    }
}
