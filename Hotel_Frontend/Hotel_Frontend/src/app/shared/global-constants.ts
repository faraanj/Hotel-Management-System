export class GlobalConstants {
  public static genericError: string = "Something went wrong. Please try again.";
  public static nameRegex: string = "^[a-zA-Z ]*$";
  public static emailRegex: string = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$";
  public static contactNumberRegex: string = "^[0-9]*$";
  public static roomNumberRegex: string = "^[0-9]*$";
  public static priceRegex: string = "^[0-9]*(\.[0-9]+)?$";
  public static roomTypeRegex: string = "(single|suite|double|luxury|family|resort)";
  public static roomDescriptionRegex: string = "^[a-zA-Z0-9 ]*$";
  public static error:string = "error";
}
