const http = require("http");
const mongoose = require("mongoose");
const Post = require("./model/post");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const errorHandle = require("./errorHandle");

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => {
    console.log("資料庫連線成功");
  })
  .catch((error) => {
    console.log(error);
  });

const requestListener = async (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  const headers = {
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, Content-Length, X-Requested-With",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PATCH, POST, GET, OPTIONS, DELETE",
    "Content-Type": "application/json",
  };

  if (req.url == "/post" && req.method == "GET") {
    try {
      const posts = await Post.find();
      res.writeHead(200, headers);
      res.write(
        JSON.stringify({
          status: "success",
          posts,
        })
      );
      res.end();
    } catch (error) {
      errorHandle(res, error);
    }
  }
  else if (req.url == "/post" && req.method == "POST") {
    req.on("end", async () => {
      try {
        const data = JSON.parse(body);
        const newPost = await Post.create({
          title: data.title,
          name: data.name,
          tags: data.tags,
          content: data.content,
        });
        res.writeHead(200, headers);
        res.write(
          JSON.stringify({
            status: "success",
            posts: newPost,
          })
        );
        res.end();
      } catch (error) {
        errorHandle(res, error);
      }
    });
  }
  else if (req.url === "/post" && req.method === "DELETE") {
    try {
      await Post.deleteMany({});
      res.writeHead(200, headers);
      res.write(
        JSON.stringify({
          status: "success",
          posts: [],
        })
      );
      res.end();
    } catch (error) {
      console.log(error);
      res.writeHead(500, headers);
      res.end();
    }
  }
  else if (req.url.startsWith("/post/") && req.method === "DELETE") {
    const postId = req.url.split("/").pop();
    try {
      const post = await Post.findByIdAndDelete(postId);
      res.writeHead(200, headers);
      res.write(
        JSON.stringify({
          status: "success",
          posts:post
        })
      );
      res.end();
    } catch (error) {
      errorHandle(res, error);
    }
  }
  else if (req.url.startsWith("/post/") && req.method === "PATCH") {
    const postId = req.url.split("/").pop();
    req.on("end", async () => {
      try {
        const data = JSON.parse(body);
        const updatedPost = await Post.findByIdAndUpdate(postId,{ $set:  data });
        res.writeHead(200, headers);
        res.write(
          JSON.stringify({
            status: "success",
            posts: updatedPost,
          })
        );
        res.end();
      } catch (error) {
        errorHandle(res, error);
      }
    });
  }
  else if (req.method === "OPTIONS") {
    res.writeHead(200, headers);
    res.end();
  }
  else {
    res.writeHead(404, headers);
    res.write(
      JSON.stringify({
        status: "false",
        message: "無此網站路由",
      })
    );
    res.end();
  }
};

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3005);
