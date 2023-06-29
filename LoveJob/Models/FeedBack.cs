using System.ComponentModel.DataAnnotations;

namespace LoveJob.Models {
    public class FeedBack {
        [Key]
        public string Id { get; set; }
        public string Title { get; set; }
        public string FeedBackText { get; set; }
        public string Time { get; set; }
    }
}
