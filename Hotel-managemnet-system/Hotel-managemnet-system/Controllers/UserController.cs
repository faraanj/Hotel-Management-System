using Hotel_managemnet_system.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Services.Description;

namespace Hotel_managemnet_system.Controllers
{
    [RoutePrefix("api/user")]
    public class UserController : ApiController
    {
        HotelEntities entities = new HotelEntities();

        [HttpPost, Route("signup")]
        public HttpResponseMessage Signup([FromBody] User user)
        {
            try
            {
                User newUser = entities.Users
                .Where(u => u.email == user.email).FirstOrDefault();
                if (newUser == null)
                {
                    user.role = "user";
                    user.status = "false";
                    entities.Users.Add(user);
                    entities.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.OK, new { message = "Successfully registered" });
                }
                else
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, new { message = "Email already exists" });
                }
            }
            catch (Exception e)
            {

                return Request.CreateResponse(HttpStatusCode.InternalServerError, e);
            }
        }

        [HttpPost, Route("login")]
        public HttpResponseMessage Login([FromBody] User user)
        {
            try
            {
                User newUser = entities.Users
                .Where(u => u.email == user.email && u.password == user.password).FirstOrDefault();
                if (newUser != null)
                {
                    if (newUser.status == "true")
                    {
                        return Request.CreateResponse(HttpStatusCode.OK, new { token = TokenManager.GenerateToken(newUser.id.ToString(), newUser.email, newUser.role, newUser.name) });
                    }
                    else
                    {
                        return Request.CreateResponse(HttpStatusCode.BadRequest, new { message = "Wait for Admin Approval" });
                    }
                }
                else
                {
                    return Request.CreateResponse(HttpStatusCode.Unauthorized, new { message = "Invalid email or password" });
                }
            }
            catch (Exception e)
            {

                return Request.CreateResponse(HttpStatusCode.InternalServerError, e);
            }
        }

        [HttpGet, Route("checkToken")]
        [CustomAuthenticationFilter]

        public HttpResponseMessage CheckToken()
        {
            try
            {
                return Request.CreateResponse(HttpStatusCode.OK, new { message = "Token is valid" });
            }
            catch (Exception e)
            {

                return Request.CreateResponse(HttpStatusCode.InternalServerError, e);
            }
        }

        [HttpGet, Route("getAllUser")]
        [CustomAuthenticationFilter]

        public HttpResponseMessage GetAllUser()
        {
            try
            {
                var token = Request.Headers.GetValues("authorization").First();
                TokenClaim tokenClaim = TokenManager.ValidateToken(token);
                if (tokenClaim.role != "admin")
                {
                    return Request.CreateResponse(HttpStatusCode.Unauthorized);
                }
                var result = entities.Users.Select(u => new
                {
                    u.id,
                    u.name,
                    u.contactNumber,
                    u.email,
                    u.role,
                    u.status
                }).Where(x => (x.role == "user")).ToList();
                return Request.CreateResponse(HttpStatusCode.OK, result);
            }
            catch (Exception e)
            {

                return Request.CreateResponse(HttpStatusCode.InternalServerError, e);
            }
        }

        [HttpPost, Route("updateUserStatus")]
        [CustomAuthenticationFilter]

        public HttpResponseMessage UpdateUserStatus(User user)
        {
            try
            {
                var token = Request.Headers.GetValues("authorization").First();
                TokenClaim tokenClaim = TokenManager.ValidateToken(token);
                if (tokenClaim.role != "admin")
                {
                    return Request.CreateResponse(HttpStatusCode.Unauthorized);
                }
                User newUser = entities.Users.Find(user.id);
                if (newUser == null)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, new { message = "User id is not found" });
                }
                newUser.status = user.status;
                entities.Entry(newUser).State = System.Data.Entity.EntityState.Modified;
                entities.SaveChanges();
                return Request.CreateResponse(HttpStatusCode.OK, new { message = "User status updated" });
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex);
            }
        }  
    }
}
