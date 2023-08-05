import { updateUserById } from '@/api-lib/db';
// import { findUserByEmail, updateUserById } from '@/api-lib/db';
import {
  findProfileByUserId,
  insertProfile,
  updateProfileByUserId,
} from '@/api-lib/db/profile';
import { auths } from '@/api-lib/middlewares';
import { getMongoDb } from '@/api-lib/mongodb';
import { ncOpts } from '@/api-lib/nc';
import { slugUsername } from '@/lib/user';
// import { ObjectId } from 'mongodb';
import nc from 'next-connect';
import isEmail from 'validator/lib/isEmail';

const handler = nc(ncOpts);

handler.use(...auths);

handler.post(async (req, res) => {
  const db = await getMongoDb();
  let { projectName, oneLiner, owner, teamMembers, reads, file } = req.body;

  if (!isEmail(owner.email)) {
    res.status(400).json({ error: { message: 'Owner email is incorrect' } });
    return;
  }

  if (req.user.profileCreated) {
    res.status(400).json({ error: { message: 'User has profile' } });
    return;
  }

  const toInsert = {
    projectName: slugUsername(projectName),
    oneLiner,
    owner: {
      firstName: owner.firstName,
      lastName: owner.lastName,
      email: owner.email,
      linkdin: owner.linkdin,
    },
    teamMembers,
    reads,
    creatorId: req.user._id,
    file,
  };

  await insertProfile(db, toInsert);
  await updateUserById(db, req.user._id, { profileCreated: true });
});

handler.get(async (req, res) => {
  const db = await getMongoDb();

  if (!req.user) return res.json({ profile: null });

  const profile = await findProfileByUserId(db, req.user._id);
  return res.json({ profile: profile });
});

handler.put(async (req, res) => {
  const db = await getMongoDb();

  if (!req.user.profileCreated) {
    res
      .status(400)
      .json({ error: { message: 'This user has not created a profile' } });
    return;
  }

  console.log('??????');
  console.log(req.body);
  console.log('??????');

  let { projectName, oneLiner, owner, teamMembers, reads, file } = req.body;

  if (!isEmail(owner.email)) {
    res.status(400).json({ error: { message: 'Owner email is incorrect' } });
    return;
  }

  const toUpdate = {
    projectName: slugUsername(projectName),
    oneLiner,
    owner: {
      firstName: owner.firstName,
      lastName: owner.lastName,
      email: owner.email,
      linkdin: owner.linkdin,
    },
    teamMembers,
    reads,
    file,
  };

  Object.keys(toUpdate).forEach(
    (key) => toUpdate[key] === undefined && delete toUpdate[key]
  );
  await updateProfileByUserId(db, req.user._id, toUpdate);

  res.status(204).end();
});

export default handler;
