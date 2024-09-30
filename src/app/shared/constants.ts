export class Constants {

  public static readonly APP = class {
    public static readonly APP_PERMISSION_NAME: string = 'KNOWLEDGESYSTEM';
  }
  public static readonly PATHS = class {
    public static readonly HOME: string = '/home';

    public static readonly QUERY = class {
      public static readonly EXPIRED: string = 'expired';
      public static readonly LOGOUT: string = 'logout';
    }
  }
  public static readonly HEADERS = class {
    public static readonly AUTHORIZATION: string = 'Authorization';
    public static readonly AUTHORIZATION_RESPONSE: string = 'authorization';
    public static readonly EXPIRES: string = 'expires';
    public static readonly TIMEZONE: string = 'X-Time-Zone';
  }
}
