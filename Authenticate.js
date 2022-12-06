/******************************************************************************
***
* ITE5315 – Project
* I declare that this assignment is my own work in accordance with Humber Academic Policy. 
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
* 
* Group member Name: Raina Patel, Mansi Patel
* Student IDs: N01452526, N01452525
* Date: December 5th, 2022
******************************************************************************
***/

const jwt=require('jsonwebtoken');

module.exports=function(req,res,next)
{
    const token=req.header('token');
    if(!token)
    res.status(401).send('Access Denied');

    try{
        
        const verifytoken=jwt.verify(token,process.env.ACCESS_TOKEN);
        next();
    }
    catch(err){
        res.status(400).send('Invalid token');
    }
}