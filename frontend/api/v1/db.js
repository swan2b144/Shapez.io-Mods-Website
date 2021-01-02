const apiVariables = require("./api_variables");
const request = require("request");

createUser = (json = { discordId, token, email, username, tag }, callback) => {
    try {
        request.post(
            `${apiVariables.server}/users/`, {
                json: json,
            },
            (error, res, body) => {
                if (!error) {
                    if (res.statusCode === 200) return callback(null, body.data);
                    else return callback(null, null);
                } else {
                    console.log(error);
                    return callback(error, null);
                }
            }
        );
    } catch (error) {
        console.log(error);
        return callback(error, null);
    }
};

updateUserById = (id, data = {}, callback) => {
    try {
        request.patch(
            `${apiVariables.server}/users/${id}`, {
                json: data,
            },
            (error, res, body) => {
                if (!error) {
                    if (res.statusCode === 200) return callback(null, body.data);
                    else return callback(null, null);
                } else {
                    console.log(error);
                    return callback(error, null);
                }
            }
        );
    } catch (error) {
        console.log(error);
        return callback(error, null);
    }
};

getUserById = (id, callback) => {
    try {
        request(
            `${apiVariables.server}/users/${id}`, {
                json: true,
            },
            (error, res, body) => {
                if (!error) {
                    if (res.statusCode === 200) return callback(null, body.data);
                    else return callback(null, null);
                } else {
                    console.log(error);
                    return callback(error, null);
                }
            }
        );
    } catch (error) {
        console.log(error);
        return callback(error, null);
    }
};

module.exports = { getUserById, updateUserById, createUser };