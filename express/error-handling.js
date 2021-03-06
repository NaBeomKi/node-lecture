import express from "express";
import fs from "fs";
import fsAsync from "fs/promises";
// require("express-async-errors");
import {} from "express-async-errors";

const app = express();

app.use(express.json());

app.get("/file1", (req, res) => {
  // 1.
  // 비동기
  // 이 경우 내부적으로 에러가 발생하고 외부로 에러가 던져지지 않기 때문에 try-catch로 에러를 잡을 수 없음
  // fs.readFile('/file1.txt', (err, data) => {
  //   if (err) {
  //     res.sendStatus(404);
  //   }
  // });

  // 2.
  try {
    // 동기
    const data = fs.readFileSync("/file1.txt");
  } catch (error) {
    res.sendStatus(404);
  }
});

app.get("/file2", (req, res) => {
  // Promise
  return fsAsync.readFile("/file2.txt");
  // express-async-errors를 사용한다면 Promise의 경우 return을 해주면 되고, async-await는 Promise로 감싸지기 때문에 그냥 사용하면 된다.
  // 그러면 Promise의 에러도 catch를 사용하지 않고 잡아낼 수 있음
});

app.get("/file3", async (req, res) => {
  // async를 사용하면 함수 자체가 Promise로 감싸지고, 내부에서는 동기처럼 작동한다.
  // 하지만 외부에서는 내부에서 발생한 에러를 알 수 없으므로 try-catch로 에러를 잡아준다.
  const data = await fsAsync.readFile("/file2.txt");
});

// 버전 5 이하에서는: require('express-async-errors');

// Express 5 부터는 이렇게
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: "Something went wrong" });
});

app.listen(8080);
