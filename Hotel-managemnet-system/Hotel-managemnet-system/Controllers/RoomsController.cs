using Hotel_managemnet_system.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Hotel_managemnet_system.Controllers
{
    [RoutePrefix("api/rooms")]
    public class RoomsController : ApiController
    {
        HotelEntities entities = new HotelEntities();

        [HttpPost, Route("addNewRoom")]
        [CustomAuthenticationFilter]
        public HttpResponseMessage AddNewRoom([FromBody] Room room)
        {
            try
            {
                var token = Request.Headers.GetValues("Authorization").FirstOrDefault();
                TokenClaim tokenClaim = TokenManager.ValidateToken(token);
                if (tokenClaim.role != "admin")
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, new { message = "You are not authorized to add room" });
                }
                room.roomStatus = "Available";
                entities.Rooms.Add(room);
                entities.SaveChanges();
                return Request.CreateResponse(HttpStatusCode.OK, new { message = "Room added successfully" });
            }
            catch (Exception e)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, e);
            }
        }

        [HttpGet, Route("getRooms/{pageNumber}")]
        [CustomAuthenticationFilter]
        public HttpResponseMessage GetRooms(int pageNumber = 1, int pageSize = 6)
        {
            try
            {
                var token = Request.Headers.GetValues("Authorization").FirstOrDefault();
                TokenClaim tokenClaim = TokenManager.ValidateToken(token);
                if (tokenClaim.role != "admin" && tokenClaim.role != "user")
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, new { message = "You are not authorized to view rooms" });
                }

                // Calculate number of rooms to skip on pages before the current page
                int skip = (pageNumber - 1) * pageSize;

                // Get total number of rooms
                int totalRooms = entities.Rooms.Count();

                // Get the rooms for the current page
                List<Room> rooms = entities.Rooms.OrderBy(r => r.roomID).Skip(skip).Take(pageSize).ToList();

                // Create a response object
                var response = new
                {
                    Rooms = rooms,
                    TotalRooms = totalRooms,
                    PageNumber = pageNumber,
                    PageSize = pageSize,
                    TotalPages = (int)Math.Ceiling((double)totalRooms / pageSize)
                };

                return Request.CreateResponse(HttpStatusCode.OK, response);
            }
            catch (Exception e)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, e);
            }
        }

        [HttpGet, Route("getRoomById/{roomID}")]
        [CustomAuthenticationFilter]
        public HttpResponseMessage GetRoomById(int roomID = 1)
        {
            try
            {
                var token = Request.Headers.GetValues("Authorization").FirstOrDefault();
                TokenClaim tokenClaim = TokenManager.ValidateToken(token);
                if (tokenClaim.role != "admin" && tokenClaim.role != "user")
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, new { message = "You are not authorized to view rooms" });
                }
                Room room = entities.Rooms.Find(roomID);
                if (room != null)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, room);
                }
                else
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, new { message = "Room not found" });
                }
            }
            catch (Exception e)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, e);
            }
        }

        [HttpGet, Route("getAvailableRooms/{pageNumber}")]
        [CustomAuthenticationFilter]
        public HttpResponseMessage GetAvailableRooms(int pageNumber = 1, int pageSize = 6)
        {
            try
            {
                var token = Request.Headers.GetValues("Authorization").FirstOrDefault();
                TokenClaim tokenClaim = TokenManager.ValidateToken(token);
                if (tokenClaim.role != "admin" && tokenClaim.role != "user")
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, new { message = "You are not authorized to view rooms" });
                }

                // Calculate number of rooms to skip on pages before the current page
                int skip = (pageNumber - 1) * pageSize;

                // Get total number of available rooms
                int totalAvailableRooms = entities.Rooms.Count(r => r.roomStatus == "Available");

                // Get the available rooms for the current page
                List<Room> availableRooms = entities.Rooms.Where(r => r.roomStatus == "Available")
                                                          .OrderBy(r => r.roomID)
                                                          .Skip(skip)
                                                          .Take(pageSize)
                                                          .ToList();

                // Create a response object
                var response = new
                {
                    AvailableRooms = availableRooms,
                    TotalAvailableRooms = totalAvailableRooms,
                    PageNumber = pageNumber,
                    PageSize = pageSize,
                    TotalPages = (int)Math.Ceiling((double)totalAvailableRooms / pageSize)
                };

                return Request.CreateResponse(HttpStatusCode.OK, response);
            }
            catch (Exception e)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, e);
            }
        }

        [HttpPost, Route("updateRooms")]
        [CustomAuthenticationFilter]
        public HttpResponseMessage UpdateRooms([FromBody] Room room)
        {
            try
            {
                var token = Request.Headers.GetValues("Authorization").FirstOrDefault();
                TokenClaim tokenClaim = TokenManager.ValidateToken(token);
                if (tokenClaim.role != "admin")
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, new { message = "You are not authorized to update room" });
                }
                Room updateRoom = entities.Rooms.Find(room.roomID);
                if (updateRoom != null)
                {
                    updateRoom.roomType = room.roomType ?? updateRoom.roomType;
                    updateRoom.price = room.price ?? updateRoom.price;
                    updateRoom.roomNumber = room.roomNumber ?? updateRoom.roomNumber;
                    updateRoom.roomDescription = room.roomDescription ?? updateRoom.roomDescription;
                    updateRoom.roomImage = room.roomImage ?? updateRoom.roomImage;
                    entities.Entry(updateRoom).State = System.Data.Entity.EntityState.Modified;
                    entities.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.OK, new { message = "Room updated successfully" });
                }
                else
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, new { message = "Room not found" });
                }
            }
            catch (Exception e)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, e);
            }
        }

        [HttpPost, Route("updateRoomStatus")]
        [CustomAuthenticationFilter]
        public HttpResponseMessage UpdateRoomStatus([FromBody] Room room)
        {
            try
            {
                var token = Request.Headers.GetValues("Authorization").FirstOrDefault();
                TokenClaim tokenClaim = TokenManager.ValidateToken(token);
                if (tokenClaim.role != "admin" && tokenClaim.role != "user")
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, new { message = "You are not authorized to update room status" });
                }

                Room updateRoom = entities.Rooms.Find(room.roomID);
                if (updateRoom != null)
                {
                    updateRoom.roomStatus = room.roomStatus ?? updateRoom.roomStatus;
                    entities.Entry(updateRoom).State = System.Data.Entity.EntityState.Modified;
                    entities.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.OK, new { message = "Room status updated successfully" });
                }
                else
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, new { message = "Room not found" });
                }
            }
            catch (Exception e)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, e);
            }
        }

        [HttpDelete, Route("deleteRoom/{roomID}")]
        [CustomAuthenticationFilter]
        public HttpResponseMessage DeleteRoom(int roomID)
        {
            try
            {
                var token = Request.Headers.GetValues("Authorization").FirstOrDefault();
                TokenClaim tokenClaim = TokenManager.ValidateToken(token);
                if (tokenClaim.role != "admin")
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, new { message = "You are not authorized to delete room" });
                }
                Room deleteRoom = entities.Rooms.Find(roomID);
                if (deleteRoom != null)
                {
                    entities.Rooms.Remove(deleteRoom);
                    entities.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.OK, new { message = "Room deleted successfully" });
                }
                else
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, new { message = "Room not found" });
                }
            }
            catch (Exception e)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, e);
            }
        }
    }
}
