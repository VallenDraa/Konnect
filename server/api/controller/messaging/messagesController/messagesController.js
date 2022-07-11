import User from '../../../../model/User.js';
import createError from '../../../../utils/createError.js';
import jwt from 'jsonwebtoken';

export const saveMessage = async (req, res, next) => {
  const { mode } = req.body;
  const { to, ...messageData } = req.body.message;

  if (mode !== 'sender' && mode !== 'receiver') {
    return createError(
      next,
      400,
      'invalid arguments, pass in either sender or receiver'
    );
  }

  //   save message
  try {
    // assemble the message that'll be pushed to the database
    const msgToPush = {
      ...messageData,
      isSent: true,
      isRead: false,
    };

    const targetId = mode === 'sender' ? msgToPush.by : to;
    const target = await User.findById(targetId).select('-password');

    const contactTargetId = mode === 'sender' ? to : msgToPush.by;

    for (let i = 0; i < target.contacts.length; i++) {
      const currContactId = target.contacts[i].user.toString();

      if (currContactId === contactTargetId) {
        // set the lastMessageReadAt to null
        target.contacts[i].lastMessageReadAt = null;
        target.contacts[i].chat.push(msgToPush);

        break;
      }
    }
    await target.save();

    return res.json({
      success: true,
      message: req.body.message,
    });
  } catch (error) {
    next(error);
  }
};

// const setToRead = (contacts, contactIndex, toBeRead) => {
//   let timesTarget = toBeRead;

//   const updatedChat = contacts[contactIndex].chat.map((chat) => {
//     let isUpdated;

//     for (const time of timesTarget) {
//       isUpdated = chat.time.toString() === new Date(time).toString();

//       if (isUpdated) {
//         timesTarget = timesTarget.filter((item) => item !== time);
//         break;
//       }
//     }

//     return isUpdated ? { ...chat, isRead: true } : chat;
//   });

//   return updatedChat._doc;
// };

// export const readMessage = async (req, res, next) => {
//   const { toBeRead, token, senderId } = req.body;

//   try {
//     const { _id } = jwt.decode(token);

//     const result = await User.where('_id', [_id, senderId]);

//     const sender = result.find(({ _id }) => _id.toString() === senderId);
//     const recipient = result.find((user) => user._id.toString() === _id);

//     // loop over the user contacts and find the correct message to be set to read
//     const senIndex = recipient.contacts.findIndex(
//       ({ user }) => user.toString() === senderId
//     );

//     recipient.contacts[senIndex].chat = setToRead(
//       recipient.contacts,
//       senIndex,
//       toBeRead
//     );

//     const recIndex = sender.contacts.findIndex(
//       ({ user }) => user.toString() === _id
//     );
//     recipient.contacts[recIndex].chat = setToRead(
//       sender.contacts,
//       recIndex,
//       toBeRead
//     );

//     recipient.markModified('contacts.chat');
//     sender.markModified('contacts.chat');
//     await recipient.save();
//     await sender.save();

//     res.json({ success: true });
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// };

export const readMessage = async (req, res, next) => {
  const { time, token, senderId } = req.body;

  // check if the time passed in is of a date format

  if (new Date(time).getMonth().toString() === NaN.toString()) {
    return createError(next, 400, 'invalid time arguments');
  }

  try {
    // this is the id for the recipient
    const { _id } = jwt.decode(token);

    // find the sender data
    const sender = await User.findById(senderId);

    // call the setToRead function
    for (let i = 0; i < sender.contacts.length; i++) {
      // set the current contact id
      const currContactId = sender.contacts[i].user.toString();

      if (currContactId === _id) {
        sender.contacts[i].lastMessageReadAt = time;
        break;
      }
    }

    // if all is gucci send success to client
    await sender.save();
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async (req, res, next) => {};
