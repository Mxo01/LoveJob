using LoveJob.Models;
using MailKit.Net.Smtp;
using MimeKit;

namespace LoveJob.UtilityService {
    public class EmailService: IEmailService {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config) {
            _config = config;
        }
        public void SendEmail(Email email) {
            var emailMessage = new MimeMessage();
            var from = _config["EmailSettings:From"];

            emailMessage.From.Add(new MailboxAddress("Mario Di Modica", from));
            emailMessage.To.Add(new MailboxAddress(email.To, email.To));
            emailMessage.Subject = email.Subject;
            emailMessage.Body = new TextPart(MimeKit.Text.TextFormat.Html) {
                Text = string.Format(email.Body)
            };

            using(var client = new SmtpClient()) {
                try {
                    client.Connect(_config["EmailSettings:SmtpServer"], 465, true);
                    client.Authenticate(_config["EmailSettings:From"], _config["EmailSettings:Password"]);
                    client.Send(emailMessage);
                }
                catch {
                    throw;
                }
                finally {
                    client.Disconnect(true);
                    client.Dispose();
                }
            }
        }
    }
}
