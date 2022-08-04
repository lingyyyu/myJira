

//json-server处理post表单请求需要用到middleware，注意配置文件package.json里也需要修改
//package.json相关json-server的一行后面加上  --middlewares ./__json_server_mock__/middleware.js
//   ./后面是中间件文件路径
module.exports = (req,res,next)=>{
    if(req.method==='POST' && req.path==='/login'){
        if(req.body.username==='jack' && req.body.password==='123456'){
            return res.status(200).json({
                user:{
                    token:'123'
                }
            })
        }
        else{
            return res.status(400).json({message:'用户名或者密码错误'})
        }
    }
}