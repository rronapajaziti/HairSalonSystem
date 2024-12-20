﻿using System.Text.Json.Serialization;

namespace HairSalon.Models
{
    public class Service
    {
        public int ServiceID { get; set; }
        public string ServiceName { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int Duration { get; set; }
        [JsonIgnore]
        public ICollection<ServiceStaff> ServiceStaff { get; set; } = new List<ServiceStaff>(); 

    }
}
