public class AppointmentDto
{
    public ClientDto Client { get; set; }
    public int? AppointmentID { get; set; }
    public int UserID { get; set; }
    public List<int> ServiceIDs { get; set; }
    public DateTime AppointmentDate { get; set; }
    public string Status { get; set; }
    public string Notes { get; set; }
}