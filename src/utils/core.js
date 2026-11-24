const bcrypt = require("bcryptjs");

const  path = require("path");
const Msg = (res, msg="",result={}) => {
    return res.status(200).json({
        success: true,
        message: msg,
        result: result
    });
};

const salt = bcrypt.genSaltSync(10);

const Encoder = {
    encode: (password) => {
        return bcrypt.hashSync(password, salt);
    },
    compare: (password, hash) => {
        return bcrypt.compareSync(password, hash);
    }
}

module.exports = {
    Msg,
    Encoder
};