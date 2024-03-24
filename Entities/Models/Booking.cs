using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Entities.BaseEntities;

namespace Entities.Models
{
    public enum BookingStatus
    {
        /// <summary>Đang xử lý</summary>
        [Display(Name = "Đang xử lý")]
        PROCESSING = 0,
        /// <summary>Hủy</summary>
        [Display(Name = "Hủy")]
        CANCELED = 1,
        /// <summary>Thành công</summary>
        [Display(Name = "Thành công")]
        COMPLETED = 2,
        /// <summary>Bảo lưu</summary>
        [Display(Name = "Bảo lưu")]
        RESERVED = 3,
    }

    [Table("Bookings")]
    public class Booking : BaseEntity
    {
        [Required]
        [StringLength(50)]
        [Display(Name = "Mã đơn hàng", Prompt = "Mã đơn hàng")]
        public string Code { set; get; }

        [Required]
        [Display(Name = "Trạng thái")]
        public BookingStatus Status { set; get; }


        [Display(Name = "Ghi chú", Prompt = "Ghi chú")]
        public string Note { set; get; }

        [Required]
        public int PaymentStatus { set; get; }

        [Required]
        public int DebitStatus { set; get; }

        [Column(TypeName = "nvarchar(MAX)")]
        [Display(Name = "Thông tin khác", Prompt = "Thông tin khác")]
        public string About { set; get; }


        [Required]
        [Display(Name = "Khách hàng")]
        public int CustomerID { set; get; }

        [ForeignKey(nameof(CustomerID))]
        public virtual Customer Customer { get; set; }


        [Display(Name = "Ngày đặt phỏng", Prompt = "Ngày đặt phòng")]
        public DateTime? DepartureDay { set; get; }

        [Display(Name = "Ngày trả phòng", Prompt = "Ngày trả phòng")]
        public DateTime? EndDate { set; get; }


    }
}
