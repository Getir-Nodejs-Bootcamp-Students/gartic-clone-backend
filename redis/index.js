const redis = require("redis");
const client = redis.createClient();
const util = require("util");
client.get = util.promisify(client.get);

client.on("error", function (error) {
    console.error(error);
});

const setObject = (key, object) => {
    client.set(key, JSON.stringify(object));
};
const getObject = async (key) => {
    const object = await client.get(key);
    return JSON.parse(object);
};

const getAllObject = async () => {
    const roomKeys = await client.keys("*", (err, keys) => {
        return keys;
    });
    console.log(keys);
    return roomKeys;
};

const deleteObject = (key) => {
    client.del(key);
};
const flushRedis = () => {
    client.flushall();
};

module.exports = {
    setObject,
    getObject,
    deleteObject,
    getAllObject,
    flushRedis,
};
