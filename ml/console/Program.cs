using System;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Net;
using System.Net.Mail;
using QuickType;
using Location;

namespace CVSPredictionSample
{
    public static class Program
    {
        static readonly int ML_PREDICTION_THRESHOLD = 90;
        static readonly string PredictionKey = "";
        static readonly string PredictionUrl = "";
        
        static readonly string FromMailAddress = "";
        static readonly string FromMailAddressPassword = "";
        static readonly string ToMailAddress = "";

        public static void Main()
        {
            string imageFilePath = "/home/pi/Desktop/projects/msft-hackathon/spectrogram_samples/spectrogram.png";

            MakePredictionRequest(imageFilePath).Wait();
        }

        public static async Task MakePredictionRequest(string imageFilePath)
        {
            var client = new HttpClient();

            // Request headers - replace this example key with your valid Prediction-Key.
            client.DefaultRequestHeaders.Add("Prediction-Key", PredictionKey);

            // Prediction URL - replace this example URL with your valid Prediction URL.
            string url = PredictionUrl;

            HttpResponseMessage response;

            // Request body. Try this sample with a locally stored image.
            byte[] byteData = GetImageAsByteArray(imageFilePath);

            using (var content = new ByteArrayContent(byteData))
            {
                content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
                response = await client.PostAsync(url, content);
                var res = await response.Content.ReadAsStringAsync();
                var probability = GetProbability(res);
                ProcessProbability(probability);
            }
        }

        private static byte[] GetImageAsByteArray(string imageFilePath)
        {
            FileStream fileStream = new FileStream(imageFilePath, FileMode.Open, FileAccess.Read);
            BinaryReader binaryReader = new BinaryReader(fileStream);
            return binaryReader.ReadBytes((int)fileStream.Length);
        }

        private static SmtpClient SetupMailServer()
        {
            SmtpClient smtp = new SmtpClient();
            smtp.Port = 587;  
            smtp.Host = "smtp.gmail.com"; //for gmail host  
            smtp.EnableSsl = true;  
            smtp.UseDefaultCredentials = false;  
            smtp.Credentials = new NetworkCredential(FromMailAddress, FromMailAddressPassword);  
            smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
            return smtp;
        }

        private static void SendMailMessage(string mailMessage)
        {
            try
            {
                SmtpClient client = SetupMailServer();
                MailMessage message = new MailMessage();
                message.From = new MailAddress(FromMailAddress);
                message.To.Add(ToMailAddress);
                message.Subject = "Fire Detected in Forest!";
                message.Body = mailMessage;
                message.IsBodyHtml = true;
                client.Send(message);
                Console.WriteLine("Mail message Sent");
            }
            catch (Exception e)
            {
                Console.WriteLine("An Exception occurred while sending the mail message");
                Console.WriteLine(e);
            }
        }

        private static string GetLocationCoordinates()
        {
            string locationFile = "/home/pi/Desktop/projects/msft-hackathon/rpi/location/location.txt";
            if (File.Exists(locationFile)) {  
                string json = File.ReadAllText(locationFile);
                var coordinates = Coordinate.FromJson(json);  
                return $"https://www.bing.com/maps?q={coordinates.Latitude}%2C+{coordinates.Longitude}";
            }
            return "No Location was recorded";
        }

        private static int GetProbability(String json)
        {
            var model = Model.FromJson(json);
            var prediction = model.Predictions[0];
            return Convert.ToInt32((prediction.Probability * 100));
        }

        private static void ProcessProbability(int probability)
        {
            if(probability > ML_PREDICTION_THRESHOLD){
                var location = GetLocationCoordinates();
                SendMailMessage($"Forest Fire Detected at the location {location}");
            }
            return;
        }
    }
}