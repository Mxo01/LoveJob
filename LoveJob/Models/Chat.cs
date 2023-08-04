using System.ComponentModel.DataAnnotations;

namespace LoveJob.Models {
    public class Chat {
        [Key]
        public string Id { get; set; }
        public string User1 { get; set; }
        public string Name1 { get; set; }
        public string User2 { get; set; }
        public string Name2 { get; set; }
        public string LastMessage { get; set; }
        public DateTime Time { get; set; }
    }
}
