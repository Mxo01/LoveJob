using Microsoft.AspNetCore.SignalR;

namespace LoveJob.Hubs {
    public class ChatHub: Hub {
        public async Task SendMessage(string senderUser, string message) => 
            await Clients.All.SendAsync("ReceiveMessage", senderUser, message);
    }
}
