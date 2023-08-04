using System.ComponentModel.DataAnnotations;

namespace LoveJob.Models {
    public class Message {
        [Key]
        public string Id { get; set; }
        public string Sender { get; set; }
        public string Receiver { get; set; }
        public string Body { get; set; }
        public DateTime DateTime { get; set; }
    }
}
