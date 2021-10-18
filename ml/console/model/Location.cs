namespace Location
{
    using System;
    using System.Collections.Generic;

    using System.Globalization;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Converters;

    /// <summary>
    /// A geographical coordinate
    /// </summary>
    public partial class Coordinate
    {
        [JsonProperty("lat", NullValueHandling = NullValueHandling.Ignore)]
        public double? Latitude { get; set; }

        [JsonProperty("lng", NullValueHandling = NullValueHandling.Ignore)]
        public double? Longitude { get; set; }
    }

    public partial class Coordinate
    {
        public static Coordinate FromJson(string json)
        {
            return JsonConvert.DeserializeObject<Coordinate>(json, Location.Converter.Settings);
        }
    }

    public static class Serialize
    {
        public static string ToJson(this Coordinate self)
        {
            return JsonConvert.SerializeObject(self, Location.Converter.Settings);
        }
    }

    internal static class Converter
    {
        public static readonly JsonSerializerSettings Settings = new JsonSerializerSettings
        {
            MetadataPropertyHandling = MetadataPropertyHandling.Ignore,
            DateParseHandling = DateParseHandling.None,
            Converters =
            {
                new IsoDateTimeConverter { DateTimeStyles = DateTimeStyles.AssumeUniversal }
            },
        };
    }
}
