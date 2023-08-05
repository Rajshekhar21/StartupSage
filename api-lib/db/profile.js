import { ObjectId } from "mongodb";

export async function insertProfile(
    db,
    profile
  ) {
    const { insertedId } = await db
      .collection('profile')
      .insertOne(profile);
    profile._id = insertedId;
    return profile;
  }
  
export async function findProfileByUserId(db, userId) {
    return db
      .collection('profile')
      .findOne({ creatorId: new ObjectId(userId) })
      .then((user) => user || null);
}

export async function updateProfileByUserId(db, userId, toUpdate) {
    console.log(userId);
    console.log("toUpdate toUpdate toUpdate toUpdate toUpdate toUpdate toUpdate toUpdate ");
    console.log(toUpdate)
    const result = await db.collection('profile').updateOne({ creatorId: new ObjectId(userId) }, { $set: toUpdate });

    console.log(`${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`);

}
