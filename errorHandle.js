const headers=require("./header");

const errorHandle=function(res,error){
    res.writeHead(400,headers);
    res.write(JSON.stringify({
        "status": "false",
        "message":"輸入內容錯誤",
        "error":error
    })),
    res.end();
}
module.exports=errorHandle;