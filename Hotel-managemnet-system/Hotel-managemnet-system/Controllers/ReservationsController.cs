using Hotel_managemnet_system.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Hotel_managemnet_system.Controllers
{
    [RoutePrefix("api/reservations")]
    public class ReservationsController : ApiController
    {
        HotelEntities entities = new HotelEntities();

        [HttpPost, Route("addNewReservation")]
        [CustomAuthenticationFilter]
        public HttpResponseMessage AddNewReservation([FromBody] Reservation reservation)
        {
            try
            {
                var token = Request.Headers.GetValues("Authorization").FirstOrDefault();
                TokenClaim tokenClaim = TokenManager.ValidateToken(token);
                if (tokenClaim.role != "admin" && tokenClaim.role != "user")
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, new { message = "You are not authorized to add reservation" });
                }
                if (reservation.userID == null || reservation.roomID == null || reservation.checkInDate == null || reservation.checkOutDate == null)
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, new { message = "Unable to complete reservation" });
                }
                Room room = entities.Rooms.FirstOrDefault(r => r.roomID == reservation.roomID);
                if (room == null)
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, new { message = "Invalid roomID" });
                }

                reservation.price = room.price * (decimal)(reservation.checkOutDate - reservation.checkInDate).Value.TotalDays;
                reservation.reservationStatus = "Pending";
                entities.Reservations.Add(reservation);
                entities.SaveChanges();
                return Request.CreateResponse(HttpStatusCode.OK, new { message = "Reservation added successfully" });
            }
            catch (Exception e)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, e);
            }
        }

        [HttpGet, Route("getReservations/{pageNumber}")]
        [CustomAuthenticationFilter]
        public HttpResponseMessage GetReservations(int pageNumber = 1, int pageSize = 5)
        {
            try
            {
                var token = Request.Headers.GetValues("Authorization").FirstOrDefault();
                TokenClaim tokenClaim = TokenManager.ValidateToken(token);
                if (tokenClaim.role != "admin" && tokenClaim.role != "user")
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, new { message = "You are not authorized to view reservations" });
                }

                // Calculate number of reservations to skip on pages before the current page
                int skip = (pageNumber - 1) * pageSize;

                // Get total number of reservations
                int totalReservations = entities.Reservations.Count();

                // Get the reservations for the current page
                List<Reservation> reservations = entities.Reservations.OrderBy(r => r.id).Skip(skip).Take(pageSize).ToList();

                return Request.CreateResponse(HttpStatusCode.OK, new { totalReservations = totalReservations, PageNumber = pageNumber, PageSize = pageSize, reservations = reservations });
            }
            catch (Exception e)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, e);
            }
        }

        [HttpGet, Route("getReservation/{id}")]
        [CustomAuthenticationFilter]
        public HttpResponseMessage GetReservation(int id)
        {
            try
            {
                var token = Request.Headers.GetValues("Authorization").FirstOrDefault();
                TokenClaim tokenClaim = TokenManager.ValidateToken(token);
                if (tokenClaim.role != "admin" && tokenClaim.role != "user")
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, new { message = "You are not authorized to view reservation" });
                }

                Reservation reservation = entities.Reservations.Where(r => r.id == id).FirstOrDefault();
                if (reservation == null)
                {
                    return Request.CreateResponse(HttpStatusCode.NotFound, new { message = "Reservation not found" });
                }

                return Request.CreateResponse(HttpStatusCode.OK, reservation);
            }
            catch (Exception e)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, e);
            }
        }

        [HttpGet, Route("getReservationsByUser/{userID}/{pageNumber}")]
        [CustomAuthenticationFilter]
        public HttpResponseMessage GetReservationsByUser(int userID, int pageNumber = 1, int pageSize = 5)
        {
            try
            {
                var token = Request.Headers.GetValues("Authorization").FirstOrDefault();
                TokenClaim tokenClaim = TokenManager.ValidateToken(token);
                if (tokenClaim.role != "admin" && tokenClaim.role != "user")
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, new { message = "You are not authorized to view reservations" });
                }

                // Calculate number of reservations to skip on pages before the current page
                int skip = (pageNumber - 1) * pageSize;

                // Get total number of reservations
                int totalReservations = entities.Reservations.Where(r => r.userID == userID).Count();

                // Get the reservations for the current page
                List<Reservation> reservations = entities.Reservations.Where(r => r.userID == userID).OrderBy(r => r.id).Skip(skip).Take(pageSize).ToList();

                return Request.CreateResponse(HttpStatusCode.OK, new { totalReservations = totalReservations, PageNumber = pageNumber, PageSize = pageSize, reservations = reservations });
            }
            catch (Exception e)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, e);
            }
        }

        [HttpPost, Route("updateReservationStatus")]
        [CustomAuthenticationFilter]
        public HttpResponseMessage UpdateReservationStatus(Reservation reservation)
        {
            try
            {
                var token = Request.Headers.GetValues("Authorization").FirstOrDefault();
                TokenClaim tokenClaim = TokenManager.ValidateToken(token);
                if (tokenClaim.role != "admin")
                {
                    return Request.CreateResponse(HttpStatusCode.Unauthorized);
                }

                Reservation newReservation = entities.Reservations.Find(reservation.id);
                if (newReservation == null)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, new { message = "Reservation id is not found" });
                }

                newReservation.reservationStatus = reservation.reservationStatus;
                entities.SaveChanges();
                return Request.CreateResponse(HttpStatusCode.OK, new { message = "Reservation status updated successfully" });
            }
            catch (Exception e)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, e);
            }
        }

        [HttpDelete, Route("deleteReservation/{id}")]
        [CustomAuthenticationFilter]
        public HttpResponseMessage DeleteReservation(int id)
        {
            try
            {
                var token = Request.Headers.GetValues("Authorization").FirstOrDefault();
                TokenClaim tokenClaim = TokenManager.ValidateToken(token);
                if (tokenClaim.role != "admin")
                {
                    return Request.CreateResponse(HttpStatusCode.Unauthorized);
                }

                Reservation reservation = entities.Reservations.Find(id);
                if (reservation == null)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, new { message = "Reservation id is not found" });
                }

                entities.Reservations.Remove(reservation);
                entities.SaveChanges();
                return Request.CreateResponse(HttpStatusCode.OK, new { message = "Reservation deleted successfully" });
            }
            catch (Exception e)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, e);
            }
        }
    }
}
