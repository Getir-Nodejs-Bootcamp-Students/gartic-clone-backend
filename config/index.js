require("dotenv").config();

//NOTE: If you are running the project in an instance, you should store these secret keys in its configuration settings.
// This type of storing secret information is only experimental and for the purpose of local running.

const { DB_URI, PORT, SECRET_KEY } = process.env;

exports.port = PORT || 3000;
exports.dbUri = DB_URI;
exports.SECRET_KEY = SECRET_KEY;
exports.wordPickTime = 10;
exports.drawTime = 30;