using Microsoft.Owin;
using Owin;
using System;
using System.Web.Cors;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http.Cors;
using Microsoft.Owin.Cors;
using System.Threading.Tasks;

[assembly: OwinStartup(typeof(Hotel_managemnet_system.Startup))]

namespace Hotel_managemnet_system
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.UseCors(new CorsOptions
            {
                PolicyProvider = new CorsPolicyProvider
                {
                    PolicyResolver = context =>
                    {
                        var policy = new CorsPolicy
                        {
                            AllowAnyHeader = true,
                            AllowAnyMethod = true,
                            SupportsCredentials = true
                        };
                   
                        policy.Origins.Add("http://localhost:4200");

                        return Task.FromResult(policy);
                    }
                }
            });

            ConfigureAuth(app);
        }
    }
}
