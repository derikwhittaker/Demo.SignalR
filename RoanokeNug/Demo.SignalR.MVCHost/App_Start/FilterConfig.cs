using System.Web;
using System.Web.Mvc;

namespace Demo.SignalR.MVCHost
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}
