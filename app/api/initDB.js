var bcrypt = require("bcryptjs");

const dbConfig = require("./app/config/db.config");
const db = require("./app/models").db;
const User = db.user;
const Role = db.role;

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initRole();
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });
const initRole = () => {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "admin",
      }).save((err) => {
        if (err) {
          console.log("error", err);
          process.exit();
        }

        console.log("added 'admin' to roles collection");
        initUser();
      });
    } else {
      console.log("Role 'admin' exists");
      process.exit();
    }
  });
};

const initUser = () => {
  const user = new User({
    email: "test@example.com",
    password: bcrypt.hashSync("123456", 8),
  });

  user.save((err, user) => {
    if (err) {
      console.log("error to save user");
      process.exit();
    }

    Role.find(
      {
        name: "admin",
      },
      (err, roles) => {
        if (err) {
          console.log("error to find role admin");
          process.exit();
        }

        user.roles = roles.map((role) => role._id);
        user.save(async (err) => {
          if (err) {
            console.log("error update role for user");
            process.exit();
          }
          console.log("added user 'test@example.com'");
          process.exit();
        });
      }
    );
  });
};
