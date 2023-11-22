import express from "express";

const router= express.Router();


//for ecs healthcheck
router.get('/',async(req,res,next)=>{

try{

    res.status(200);
    
}catch(e)
{

    res.status(503)
}
    
});

export default router;