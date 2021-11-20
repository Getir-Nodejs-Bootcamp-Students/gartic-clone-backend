const User = require("../model/User")

const signUp = async (req, res) => {
    const user = new User(req.body)
};
const signIn = () => {};

module.exports = { signIn, signUp };
