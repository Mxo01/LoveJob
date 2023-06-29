namespace LoveJob.Helpers {
    public static class EmailBody {
        public static string EmailStringBody(string email, string emailToken) {
            return $@"
                <html>
                <head>
                </head>
                <body style=""margin: 0; padding: 0; font-family: Poppins, sans-serif;"">
                    <div style=""height: auto; width: 400px; padding: 30px; background-color: rgb(219, 219, 219); border-radius: 20px; margin: 20px;"">
                        <div>
                            <div>
                            <h1 style=""text-align: center;"">Reset your password</h1>
                            <hr>
                            <p>You're receiving this email beacuse you requested a password reset for your LoveJob's account.</p>
                            <p>Please tap the button below to choose a new password.</p>
                            <a href=""http://localhost:4200/resetpassword?email={email}&code={emailToken}"" target=""_blank"" style=""background: #0b5ed7; padding: 10px; border: none; color: white; border-radius: 10px; display: block; margin: 0 auto; width: 50%; text-align: center; text-decoration: none"">Reset Password</a><br>
                            <p style=""font-style: italic;"">Kind Regards, LoveJob</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
              ";
        }
    }
}
