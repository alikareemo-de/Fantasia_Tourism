using System.Net.Mail;

namespace Fantasis_Tourism_Service.Service
{
    public class EmailService : IEmailSender
    {
        private readonly string _smtpServer = "localhost";
        private readonly int _port = 25;
        private readonly string _fromEmail = "test@local.com";

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            try
            {
                using (var client = new SmtpClient())
                {
                    client.Host = _smtpServer;
                    client.Port = _port;
                    client.DeliveryMethod = SmtpDeliveryMethod.Network;
                    client.EnableSsl = false;
                    client.Credentials = null;

                    var mailMessage = new MailMessage
                    {
                        From = new MailAddress(_fromEmail),
                        Subject = subject,
                        Body = body,
                        IsBodyHtml = true
                    };

                    mailMessage.To.Add(toEmail);

                    await client.SendMailAsync(mailMessage);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error sending email: " + ex.Message);
                throw;
            }
        }
    }
}


