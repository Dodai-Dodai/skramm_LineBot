import express from "express";
import { Client, middleware } from "@line/bot-sdk";

const config = {
    channelSecret: process.env.CHANNEL_SECRET,
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  };
  const client = new Client(config);
  const PORT = process.env.PORT || 3000;
const app = express();



app.post("/", middleware(config), (req, res) => {
  console.log("=============req.body=============");
  console.log(req.body);
  console.log("=============req.body.events=============");
  console.log(req.body.events);
  console.log("=============req.body.events[0].message.text=============");
  console.log(req.body.events[0].message.text);
  console.log("=============ここまで=============");
  Promise.all(req.body.events.map(handleEvent)).then((result) =>
    res.json(result)
  );
});


app.listen(PORT);


function handleEvent(event) {
    if (event.type !== "message" || event.message.type !== "text") {
      return Promise.resolve(null);
    }else if(event.type == "beacon"){
      return client.replyMessage(event.replyToken, {
        type: "text",
        text: "ビーコンを検知しました",
      });
    }
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: event.message.text,
    });
  }

