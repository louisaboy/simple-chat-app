const Chat = require('../models/Chat');

exports.addMessage = async (req, res, next) => {
    try {
        const {from, to, message} = req.body;
        const data = await Chat.create({
            message: { text: message },
            users: [from, to],
            sender: from,
        });
        if (data) return res.json({ msg: "Message added successfully."});
        return res.json ({ msg: "Failed to add message to the database."});
    } catch (err) {
        next(err);
    }
}
exports.getAllMessage = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    console.log("Getting messages:");
    console.log(`From: ${from} -- To: ${to}`);
    const messages = await Chat.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    console.log("Error getting messages");
    next(ex);
  }
};