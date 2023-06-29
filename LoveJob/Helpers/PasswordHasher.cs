using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System.Security.Cryptography;

namespace LoveJob.Helpers {
    public class PasswordHasher {
        public static string HashPassword(string password) {
            var salt = GenerateSalt(16);

            var bytes = KeyDerivation.Pbkdf2(password, salt, KeyDerivationPrf.HMACSHA512, 10000, 16);

            return $"{Convert.ToBase64String(salt)}:{Convert.ToBase64String(bytes)}";
        }

        public static byte[] GenerateSalt(int length) {
            var salt = new byte[length];

            using (var random = RandomNumberGenerator.Create()) {
                random.GetBytes(salt);
            }

            return salt;
        }

        public static bool VerifyPassword(string hash, string password) { 
            try {
                var parts = hash.Split(":");

                var salt = Convert.FromBase64String(parts[0]);

                var bytes = KeyDerivation.Pbkdf2(password, salt, KeyDerivationPrf.HMACSHA512, 10000, 16);

                return parts[1].Equals(Convert.ToBase64String(bytes));
            }

            catch {
                return false;
            }
        }
    }
}
