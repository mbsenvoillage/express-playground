import * as mongoose from "mongoose";
import Post from "./post.interface";

const postSchema = new mongoose.Schema({
  author: String,
  content: String,
  title: String,
});

// Intersection types represent values that simultaneously have multiple types.
const postModel = mongoose.model<Post & mongoose.Document>("Post", postSchema);
export default postModel;
