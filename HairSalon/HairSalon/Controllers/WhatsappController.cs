using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;

[ApiController]
[Route("api/whatsapp")]
public class WhatsAppController : ControllerBase
{
    private readonly string accountSid = "AC7b728fd2d9c29069338fbb98be0846db"; // Replace with your Twilio Account SID
    private readonly string authToken = "3fd52b15c72e21e80ef8cfa1648732ec"; // Replace with your Twilio Auth Token
    private readonly string fromWhatsAppNumber = "whatsapp:+14155238886"; // Replace with Twilio's WhatsApp number

    public WhatsAppController()
    {
        TwilioClient.Init(accountSid, authToken);
    }
    [HttpPost("send-message")]
    public async Task<IActionResult> SendMessage([FromBody] ClientMessage request)
    {
        Console.WriteLine("Received request to send WhatsApp message:");
        Console.WriteLine(JsonConvert.SerializeObject(request));

        try
        {
            // Create message options for WhatsApp
            var messageOptions = new CreateMessageOptions(new PhoneNumber($"whatsapp:{request.PhoneNumber}"))
            {
                From = new PhoneNumber(fromWhatsAppNumber),
                ContentSid = "HXb5b62575e6e4ff6129ad7c8efe1f983e", // Replace with your approved template SID
                ContentVariables = JsonConvert.SerializeObject(new
                {
                    param1 = "12/1", // Replace 'param1' with the actual name of your template variable
                    param2 = "3pm"  // Replace 'param2' with the actual name of your template variable
                })
            };

            // Send message via Twilio
            var message = MessageResource.Create(messageOptions);

            // Log success
            Console.WriteLine($"Message sent. SID: {message.Sid}, Status: {message.Status}");
            return Ok(new { status = "Message sent successfully", messageSid = message.Sid });
        }
        catch (Exception ex)
        {
            // Log error
            Console.WriteLine($"Error sending message: {ex.Message}");
            return StatusCode(500, new { status = "Message failed to send", error = ex.Message });
        }
    }

}

public class ClientMessage
{
    public string PhoneNumber { get; set; }
    public string Message { get; set; }
}
