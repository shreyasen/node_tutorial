const fs = require("fs");
const http = require("http");

const server = http.createServer((req, res) => {
  //this function gets executed whenever a new incoming request comes
  const url = req.url;
  const method = req.method;
  if (url === "/") {
    res.write("<html>");
    res.write(
      '<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>'
    );
    res.write("</html>");
    return res.end(); // here return is important because otherwise it will execute the code after if block and throw error as res.write is not allowed after res.end
  }
  if (url === "/message" && method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      console.log(chunk);
      body.push(chunk);
    });

    //this will be fired once it's done parsing parsing the incoming requests data
    // return is important here, otherwise the code outside the if block will execute first,then the eventlistener function of 'end' will execute and throw error
    return req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      console.log(parsedBody); // message=something here message in the left is the name attribute of the input text
      const message = parsedBody.split("=")[1];
      fs.writeFile("message.txt", message, (err) => {
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      });
    });
  }
  res.write("<html>");
  res.write("<body><h3>Welcome to Node JS</h3></body>");
  res.write("</html>");
  res.end();
});

server.listen(3000);
