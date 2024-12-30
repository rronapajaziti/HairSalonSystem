using System;
using System.Threading.Tasks;
using Twilio;
using Twilio.Rest.Api.V2010.Account;

public class WhatsAppService
{
    private readonly string accountSid = "your_account_sid";
    private readonly string authToken = "your_auth_token";
    private readonly string fromWhatsAppNumber = "whatsapp:+38344378454";

    public WhatsAppService()
    {
        TwilioClient.Init(accountSid, authToken);
    }

    public async Task SendWhatsAppMessage(string toNumber, string message)
    {
        try
        {
            var messageResponse = await MessageResource.CreateAsync(
                from: new Twilio.Types.PhoneNumber(fromWhatsAppNumber),
                to: new Twilio.Types.PhoneNumber($"whatsapp:{toNumber}"),
                body: message
            );

            Console.WriteLine($"Message sent to {toNumber}: {messageResponse.Sid}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error sending message to {toNumber}: {ex.Message}");
        }
    }
}
