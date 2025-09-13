namespace Fantasis_Tourism_Service.Service
{
    public interface IEmailSender
    {
        Task SendEmailAsync(string to, string subject, string body);

    }
}
