import jwt from 'jsonwebtoken';
export function auth(req,res,next){try{req.userId=jwt.verify(req.headers.authorization?.split(' ')[1],process.env.JWT_SECRET).sub;next()}catch{res.status(401).json({error:'Sign in required'})}}
export const wrap=fn=>(req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
export function fail(status,message){throw Object.assign(new Error(message),{status})}
