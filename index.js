const http = require("http");
const fs = require("fs");
var requests = require('requests');

const indexfile = fs.readFileSync("index.html", "utf-8");
const replaceVal =(tempVal,orgVal)=>{
  let temperature=tempVal.replace("{%tempval%}",orgVal.main.temp/10);
  temperature=temperature.replace("{%tempmin%}",orgVal.main.temp_min/10);
   temperature=temperature.replace("{%tempmax%}",orgVal.main.temp_max/10);
  temperature=temperature.replace("{%location%}",orgVal.name);
  temperature=temperature.replace("{%country%}",orgVal.sys.country);
  temperature=temperature.replace("{%temStatus%}",orgVal.weather[0].main);
  
  return temperature;
}
const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests("https://api.openweathermap.org/data/2.5/weather?q=allahabad&appid=7887b9bf1a706cf2b7311b34ce180f0a")
      .on("data", (chunk) => {
        const objdata=JSON.parse(chunk);
        const arrData=[objdata]
        // console.log(arrData[0].main.temp);
        const realTimeData=arrData.map((val) => 
          // console.log(val.main);
           replaceVal(indexfile,val)).join("");
          res.write(realTimeData);
        })
    
      .on("end", (err) => {
        if (err) return console.log('connection closed due to errors', err);

        console.log("end");
      });
  }
  // weatherAppNodejs   

});
server.listen(3000, "127.0.0.1");