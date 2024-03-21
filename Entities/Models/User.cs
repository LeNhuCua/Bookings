using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Entities.BaseEntities;

namespace Entities.Models
{
    [Table("Users")]
    public class User : BaseEntity
    {

        [StringLength(50)]
        [Display(Name = "Full name")]
        public string? FullName { set; get; }

        [Display(Name = "Gender")]
        public int? Gender { set; get; }

        [Required]
        [Display(Name = "Root")]
        public bool IsRoot { set; get; }

        [Required]
        [StringLength(50)]
        [Display(Name = "Phone", Prompt = "Phone")]
        public string? Phone { set; get; }

        [StringLength(250)]
        [Display(Name = "Address", Prompt = "Address")]
        public string? Address { set; get; }

        [Required]
        [StringLength(50)]
        [Display(Name = "Email")]
        public string? Email { set; get; }

        [Required]
        [Display(Name = "Password")]
        [MaxLength(255)]
        [JsonIgnore]
        public string? Password { set; get; }

        [StringLength(150)]
        [Display(Name = "Avatar")]
        public string? Avatar { set; get; }

        [NotMapped]
        public string? AvatarUrl  => $"/media/avatars/" ;

    }
}
