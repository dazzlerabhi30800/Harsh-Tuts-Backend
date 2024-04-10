class ApiResponse {
  data: any;
  statusCode: number;
  message: string;
  success: boolean;
  constructor(statusCode: number, data: any, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.success = statusCode < 400 ? true : false;
    this.message = message;
  }
}
