//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Hotel_managemnet_system.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class Reservation
    {
        public int id { get; set; }
        public Nullable<System.DateTime> checkInDate { get; set; }
        public Nullable<System.DateTime> checkOutDate { get; set; }
        public Nullable<decimal> price { get; set; }
        public string reservationStatus { get; set; }
        public Nullable<int> roomID { get; set; }
        public Nullable<int> userID { get; set; }
    
        public virtual Room Room { get; set; }
        public virtual User User { get; set; }
    }
}
