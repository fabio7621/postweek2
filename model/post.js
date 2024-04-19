const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "請填寫標題"],
    },
    name: {
      type: String,
      required: [true, "請填寫名稱"],
    },
    tags: [
      {
        type: String,
        required: [true, "貼文標籤 tags 未填寫"],
      },
    ],
    content: {
      type: String,
      required: [true, "內文未填寫"],
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
const Post = mongoose.model("post", postSchema);

module.exports = Post;
