import {db} from '../models/db.js';import {fail} from '../middleware/auth.js';
export async function member(userId,workspaceId,admin=false){const m=await db.member.findUnique({where:{userId_workspaceId:{userId,workspaceId}}});if(!m||admin&&m.role!=='OWNER')fail(403,'Access denied');return m}
export async function project(userId,id){const p=await db.project.findUnique({where:{id}});if(!p)fail(404,'Project not found');await member(userId,p.workspaceId);return p}
export async function task(userId,id){const t=await db.task.findUnique({where:{id},include:{project:true}});if(!t)fail(404,'Task not found');await member(userId,t.project.workspaceId);return t}
