const { User } = require("../../../models/User");
const auth = require("../../../middleware/auth");
const mongoose = require("mongoose");

describe("auth middleware", () => {
  it("should populate req.user with the payload of a valid jwt", async () => {
    const user = {
      _id: new mongoose.Types.ObjectId().toHexString(),
    };
    const token = await User(user).generateAuthToken();
    const req = {
      header: jest.fn().mockReturnValue(token),
    };
    let res = {};
    const next = jest.fn();

    auth(req, res, next);

    expect(req.user).toMatchObject(user);
  });
});
