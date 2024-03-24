using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Entities.BaseEntities;

namespace Entities.Models
{
    [Table("CustomerTypes")]
    public class CustomerType : BaseEntity
    {
        [Required]
        [StringLength(50)]
        [Display(Name = "Loại khách hàng", Prompt = "Tên loại khách hàng")]
        public string Name { set; get; }

        public virtual IEnumerable<Customer> Customers { get; set; }
    }
}
