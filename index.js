import express from "express";
import { Client, middleware } from "@line/bot-sdk";

const beaconMsg = "ビーコンを検知しました"

const config = {
    channelSecret: process.env.CHANNEL_SECRET,
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  };
  const client = new Client(config);
  const PORT = process.env.PORT || 3000;
const app = express();



app.post("/", middleware(config), (req, res) => {
  console.log("=============req=============");
  console.log(req);
  console.log("=============req.body=============");
  console.log(req.body);
  console.log("=============req.body.events=============");
  console.log(req.body.events);
  
  console.log("=============ここまで=============");
  Promise.all(req.body.events.map(handleEvent)).then((result) =>
    res.json(result)
  );
});


app.listen(PORT);


function handleEvent(event) {
    if (event.type == "message" || event.message.type == "text") {
      client.replyMessage(event.replyToken, {
        type: "text",
        text: event.message.text,
      });
    }else if(event.type == "beacon"){
      console.log("beaconを検知しました");
    }
  }

