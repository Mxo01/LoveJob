using LoveJob.Models;
using Microsoft.EntityFrameworkCore;

namespace LoveJob.Context {
    public class UsersDbContext: DbContext {
        public UsersDbContext(DbContextOptions<UsersDbContext> options): base(options) {
            
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Marker> Markers { get; set; }
        public DbSet<Favorite> Favorites { get; set; }
        public DbSet<FeedBack> FeedBacks { get; set; }
        public DbSet<Chat> Chats { get; set; }
        public DbSet<Message> Messages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder) {
            modelBuilder.Entity<User>().ToTable("users");
            modelBuilder.Entity<Marker>().ToTable("markers");
            modelBuilder.Entity<Favorite>().ToTable("favorites");
            modelBuilder.Entity<FeedBack>().ToTable("feedbacks");
            modelBuilder.Entity<Chat>().ToTable("chats");
            modelBuilder.Entity<Message>().ToTable("messages");
        }
    }
}