using System.ComponentModel.DataAnnotations;

namespace LoveJob.Models {
    public class Marker {
        [Key]
        public string Id { get; set; }
        public float Lat { get; set; }
        public float Lng { get; set; }
        public string By { get; set; }
        public string Name { get; set; }
        public string CompanyName { get; set; }
        public string Position { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public int Salary { get; set; }
    }
}
