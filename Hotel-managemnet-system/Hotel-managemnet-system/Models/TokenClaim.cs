using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Hotel_managemnet_system.Models
{
    public class TokenClaim
    {
        public string id { get; set; }
        public string email { get; set; }
        public string role { get; set; }
        public string name { get; set; }
    }
}