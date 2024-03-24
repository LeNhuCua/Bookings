using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Entities.BaseEntities;

namespace Entities.Models
{
    [Table("Customers")]
    public class Customer : BaseEntity
    {
        [StringLength(50)]
        [Display(Name = "Danh xưng", Prompt = "Danh xưng")]
        public string Vocative { set; get; }

        [Required]
        [StringLength(50)]
        [Display(Name = "Mã khách hàng", Prompt = "Mã khách hàng")]
        public string Code { set; get; }

        [StringLength(50)]
        [Display(Name = "Họ và tên đệm", Prompt = "Họ và tên đệm")]
        public string FirstMidName { set; get; }

        [StringLength(50)]
        [Display(Name = "Tên", Prompt = "Tên")]
        public string LastName { set; get; }

        [Display(Name = "Ngày sinh", Prompt = "Ngày sinh")]
        public DateTime? Birthday { set; get; }

        [Display(Name = "Giới tính", Prompt = "Giới tính")]
        public int? Gender { set; get; }

        [StringLength(50)]
        [Display(Name = "Số điện thoại", Prompt = "Số điện thoại")]
        public string Phone { set; get; }


        [StringLength(250)]
        [Display(Name = "Địa chỉ", Prompt = "Địa chỉ")]
        public string Address { set; get; }

        [StringLength(250)]
        public string Email { set; get; }

        [Column(TypeName = "nvarchar(MAX)")]
        [Display(Name = "Thông tin khác", Prompt = "Thông tin khác")]
        public string About { set; get; }

        [Display(Name = "Tỉnh/Thành phố")]
        public int? ProvinceID { set; get; }

        [Display(Name = "Loại khách hàng")]
        public int? CustomerTypeID { set; get; }

        [ForeignKey(nameof(ProvinceID))]
        public virtual Province Province { get; set; }

        [ForeignKey(nameof(CustomerTypeID))]
        public virtual CustomerType CustomerType { get; set; }

        [NotMapped]
        [Display(Name = "Họ và tên")]
        public string FullName { get { return Vocative + " " + FirstMidName + " " + LastName; } }

        [NotMapped]
        [Display(Name = "Họ và tên")]
        public string FilterName { get { return FirstMidName + " " + LastName + " - " + Phone; } }

        public ICollection<Booking> Bookings { get; set; }
    }
}
