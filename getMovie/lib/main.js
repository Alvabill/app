const express = require("express");
const app = express();
const router = express.Router();

const port = process.env.PORT || 3000;

router.get('/',(req,res)=>{
	res.send('hello world');
});

app.use('/getMovie',router);
app.listen(port, ()=>{
	console.log('Magic happens on port ' + port);
});
