using LoveJob.Models;

namespace LoveJob.UtilityService {
    public interface IEmailService {
        void SendEmail(Email email);
    }
}
