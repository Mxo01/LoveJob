using LoveJob.Context;
using LoveJob.Helpers;
using LoveJob.Models;
using LoveJob.Models.Dto;
using LoveJob.UtilityService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

namespace LoveJob.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController: Controller {
        private readonly UsersDbContext _usersDbContext;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;

        public AuthenticationController(UsersDbContext usersDbContext, IConfiguration configuration, IEmailService emailService) {
            _usersDbContext = usersDbContext;
            _configuration = configuration;
            _emailService = emailService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User user) {
            if (user == null) return BadRequest();

            var newUser = await _usersDbContext.Users.FirstOrDefaultAsync(u => (u.Username == user.Username));

            if (newUser == null) return NotFound(new { Message = "User Not Found" });

            if (!PasswordHasher.VerifyPassword(newUser.Password, user.Password)) 
                return BadRequest(new { Message = "Wrong Password" });

            newUser.Token = CreateJwtToken(newUser);
            var newAccessToken = newUser.Token;
            var newRefreshToken = CreateRefreshToken();
            newUser.RefreshToken = newRefreshToken;
            newUser.RefreshTokenExpiry = DateTime.Now.AddDays(5);

            await _usersDbContext.SaveChangesAsync();

            return Ok(new TokenApiDto() {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken
            });
        }

        [HttpPost("sendResetEmail/{emailString}")]
        public async Task<IActionResult> SendEmail([FromRoute] string emailString) {
            var user = await _usersDbContext.Users.FirstOrDefaultAsync(u => u.Email == emailString);

            if (user == null) return NotFound(new {
                StatusCode = 404,
                Message = "Email Doesn't Exist"
            });

            var tokenBytes = RandomNumberGenerator.GetBytes(64);
            var emailToken = Convert.ToBase64String(tokenBytes);

            user.ResetPasswordToken = emailToken;
            user.ResetPasswordExpiry = DateTime.Now.AddMinutes(15);

            string from = _configuration["EmailSettings:From"];
            var email = new Email(emailString, "Reset Password", EmailBody.EmailStringBody(emailString, emailToken));

            _emailService.SendEmail(email);

            _usersDbContext.Entry(user).State = EntityState.Modified;

            await _usersDbContext.SaveChangesAsync();

            return Ok(new {
                StatusCode = 200,
                Message = "Email Sent!"
            });
        }

        [HttpPost("resetPassword")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto resetPasswordDto) {
            var newToken = resetPasswordDto.EmailToken.Replace(" ", "+");

            var user = await _usersDbContext.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Email == resetPasswordDto.Email);

            if (user == null) return NotFound(new {
                StatusCode = 404,
                Message = "User Doesn't Exist"
            });

            var tokenCode = user.ResetPasswordToken;
            DateTime emailTokenExpiry = user.ResetPasswordExpiry;

            if (tokenCode != resetPasswordDto.EmailToken || emailTokenExpiry <= DateTime.Now) {
                return BadRequest(new {
                    StatusCode = 400,
                    Message = "Invalid reset link"
                });
            }

            user.Password = PasswordHasher.HashPassword(resetPasswordDto.NewPassword);

            _usersDbContext.Entry(user).State = EntityState.Modified;

            await _usersDbContext.SaveChangesAsync();

            return Ok(new {
                StatusCode = 200,
                Message = "Password reset succesfully"
            });
        }

        [HttpPost("signup")]
        public async Task<IActionResult> Signup([FromBody] User user) {
            if (user == null) return BadRequest();

            if (await CheckUsernameExists(user.Username)) return BadRequest(new { Message = "User already exists" });
            var pass = CheckPasswordStrength(user.Password);

            if (!string.IsNullOrEmpty(pass)) return BadRequest(new { Message = pass.ToString() });

            user.Password = PasswordHasher.HashPassword(user.Password);
            user.Role = "User";
            user.Token = "";

            await _usersDbContext.Users.AddAsync(user);
            await _usersDbContext.SaveChangesAsync();

            return Ok(new { Message = "User Registered" });
        }

        [HttpPost("refreshToken")]
        public async Task<IActionResult> RefreshToken([FromBody] TokenApiDto tokenApiDto) {
            if (tokenApiDto == null) return BadRequest(new { Message = "Invalid Client Request" });

            string accessToken = tokenApiDto.AccessToken;
            string refreshToken = tokenApiDto.RefreshToken;

            var principal = GetPrincipalFromExpiredToken(accessToken);
            var username = principal.Identity.Name;
            var user = await _usersDbContext.Users.FirstOrDefaultAsync(u => u.Username == username);

            if (user == null || user.RefreshToken != refreshToken || user.RefreshTokenExpiry <= DateTime.Now) 
                return BadRequest(new { Message = "Invalid Request" });

            var newAccessToken = CreateJwtToken(user);
            var newRefreshToken = CreateRefreshToken();

            user.RefreshToken = newRefreshToken;

            await _usersDbContext.SaveChangesAsync();

            return Ok(new TokenApiDto() {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken
            });
        }

        [HttpPost("sendFeedBack")]
        public async Task<IActionResult> SendFeedBack([FromBody] FeedBack feedBack) {
            if (feedBack == null) return BadRequest();

            await _usersDbContext.FeedBacks.AddAsync(feedBack);
            await _usersDbContext.SaveChangesAsync();

            return Ok(new { Message = "FeedBack Added" });
        }

        [HttpDelete("deleteFeedBack/{id}")]
        public async Task<IActionResult> DeleteFeedBack([FromRoute] string id) {
            var feedBack = await _usersDbContext.FeedBacks.FindAsync(id);

            if (feedBack == null) return NotFound(new { Message = "FeedBack Not Found" });

            _usersDbContext.Remove(feedBack);
            _usersDbContext.SaveChanges();

            return Ok(new { Message = "FeedBack Deleted" });
        }

        [HttpGet("getFeedBacks")]
        public async Task<IActionResult> GetAllFeedBacks() {
            var feedBacks = await _usersDbContext.FeedBacks.ToListAsync();

            return Ok(feedBacks);
        }

        [HttpGet("getUser/{username}")]
        public async Task<IActionResult> GetUser([FromRoute] string username) {
            var user = await _usersDbContext.Users.FindAsync(username);

            if (user == null) return NotFound(new { Message = "User Not Found" });
            
            return Ok(user);
        }

        [HttpPut("editUser/{username}")]
        public async Task<IActionResult> EditUser([FromRoute] string username, [FromBody] User updateUserRequest) {
            var user = await _usersDbContext.Users.FindAsync(username);

            if (user == null) return NotFound(new { Message = "User Not Found" });

            var pass = CheckPasswordStrength(updateUserRequest.Password);

            if (!string.IsNullOrEmpty(pass)) return BadRequest(new { Message = pass.ToString() });

            if (updateUserRequest.Token == "pwd") user.Password = PasswordHasher.HashPassword(updateUserRequest.Password);
            else user.Password = updateUserRequest.Password;
            user.Email = updateUserRequest.Email;
            user.FirstName = updateUserRequest.FirstName;
            user.LastName = updateUserRequest.LastName;
            user.Position = updateUserRequest.Position;
            user.CompanyName = updateUserRequest.CompanyName;
            user.Role = updateUserRequest.Role;

            await _usersDbContext.SaveChangesAsync();

            return Ok(user);
        }

        [HttpDelete("deleteUser/{username}")]
        public async Task<IActionResult> DeleteUser([FromRoute] string username) {
            var user = await _usersDbContext.Users.FindAsync(username);

            if (user == null) return NotFound(new { Message = "User Not Found" });

            _usersDbContext.Remove(user);
            _usersDbContext.SaveChanges();

            return Ok(new { Message = "User Deleted" });
        }

        [HttpGet("getMarkers")]
        public async Task<IActionResult> GetAllMarkers() {
            var markers = await _usersDbContext.Markers.ToListAsync();

            return Ok(markers);
        }

        [HttpPost("addMarker")]
        public async Task<IActionResult> AddMarker([FromBody] Marker marker) {
            if (marker == null) return BadRequest();

            await _usersDbContext.Markers.AddAsync(marker);
            await _usersDbContext.SaveChangesAsync();

            return Ok(new { Message = "Marker Added" });
        }

        [HttpDelete("deleteMarker/{id}")]
        public async Task<IActionResult> DeleteMarker([FromRoute] string id) {
            Marker marker = await _usersDbContext.Markers.FindAsync(id);

            if (marker == null) return NotFound(new { Message = "Marker Not Found" });

            _usersDbContext.Remove(marker);
            _usersDbContext.SaveChanges();

            return Ok(new { Message = "Marker Deleted" });
        }

        [HttpDelete("deleteMarkers/{username}")]
        public async Task<IActionResult> DeleteMarkersByUsername([FromRoute] string username) {
            var markers = await _usersDbContext.Markers.ToListAsync();

            foreach (var marker in markers) {
                if (marker.By == username) _usersDbContext.Remove(marker);
            }

            await _usersDbContext.SaveChangesAsync();

            return Ok(new { Message = "Markers Deleted" });
        }

        [HttpGet("getFavorites/{username}")]
        public async Task<IActionResult> GetAllFavorites([FromRoute] string username) {
            var favorites = await _usersDbContext.Favorites.Where(f => f.Owner == username).ToListAsync();

            return Ok(favorites);
        } 

        [HttpPost("addFavorite")]
        public async Task<IActionResult> AddFavorite([FromBody] Favorite favorite) {
            if (favorite == null) return BadRequest();

            await _usersDbContext.Favorites.AddAsync(favorite);
            await _usersDbContext.SaveChangesAsync();

            return Ok(new { Message = "Favorite Added" });
        }

        [HttpDelete("deleteFavorite/{id}")]
        public async Task<IActionResult> DeleteFavorite([FromRoute] string id) {
            Favorite favorite = await _usersDbContext.Favorites.FindAsync(id);

            if (favorite == null) return NotFound(new { Message = "Favorite Not Found" });

            _usersDbContext.Remove(favorite);
            _usersDbContext.SaveChanges();

            return Ok(new { Message = "Favorite Deleted" });
        }

        [HttpDelete("deleteFavorites/{username}")]
        public async Task<IActionResult> DeleteFavoritesByUsername([FromRoute] string username) {
            var favorites = await _usersDbContext.Favorites.ToListAsync();

            foreach (var favorite in favorites) {
                if (favorite.By == username) _usersDbContext.Remove(favorite);
            }

            await _usersDbContext.SaveChangesAsync();

            return Ok(new { Message = "Favorites Deleted"} );
        }

        private Task<bool> CheckUsernameExists(string username) {
            return _usersDbContext.Users.AnyAsync(u => u.Username == username);
        }

        private string CheckPasswordStrength(string password) {
            StringBuilder sb = new();

            if (password.Length < 8) 
                sb.Append("Minimum password length should be 8" + Environment.NewLine);

            if (!(Regex.IsMatch(password, "[a-z]") && Regex.IsMatch(password, "[A-Z]") && Regex.IsMatch(password, "[0-9]")))
                sb.Append("Password should be alphanumeric" + Environment.NewLine);

            if (!Regex.IsMatch(password, "[<,>,@,!,#,$,%,^,&,*,(,),_,+,\\[,\\],{,{,?,:,;,|,',\\,.,/,`,~,-,=]"))
                sb.Append("Password should contain special characters" + Environment.NewLine);

            return sb.ToString();
        }

        private string CreateJwtToken(User user) {
            var jwtTokenHandler = new JwtSecurityTokenHandler();

            var key = Encoding.ASCII.GetBytes("mySuperSecretSecurityKey");

            var identity = new ClaimsIdentity(new Claim[] {
                new Claim(ClaimTypes.Role, user.Role),
                new Claim(ClaimTypes.Name, user.Username)
            });

            var credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor {
                Subject = identity,
                Expires = DateTime.Now.AddSeconds(10),
                SigningCredentials = credentials
            };

            var token = jwtTokenHandler.CreateToken(tokenDescriptor);

            return jwtTokenHandler.WriteToken(token);
        }

        private string CreateRefreshToken() {
            var tokenBytes = RandomNumberGenerator.GetBytes(64);
            var refreshToken = Convert.ToBase64String(tokenBytes);

            var tokenInUser = _usersDbContext.Users.Any(user => user.RefreshToken == refreshToken);

            if (tokenInUser) return CreateRefreshToken();

            return refreshToken;
        }

        private ClaimsPrincipal GetPrincipalFromExpiredToken(string token) {
            var key = Encoding.ASCII.GetBytes("mySuperSecretSecurityKey");

            var tokenValidationParameters = new TokenValidationParameters {
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateLifetime = false
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            SecurityToken securityToken;

            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out securityToken);

            var jwtSecurityToken = securityToken as JwtSecurityToken;

            if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase)) {
                throw new SecurityTokenException("This is Invalid Token");
            }

            return principal;
        }
    }
}