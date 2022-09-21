import type { NextApiRequest, NextApiResponse } from 'next'
import nc from "next-connect";
import {PrismaClient, User} from '../../src/generated/client';

// a instance of the database client
let dbclient = new PrismaClient()

interface ExtendedRequest extends NextApiRequest {
  body: User
}

// logger middleware
const logger = (req: NextApiRequest, res: NextApiResponse, next: Function) => {
  console.log('req: ' + req.method, req.url, req.headers['x-forwarded-for'] || req.socket.remoteAddress )
  next()
}

const handler = nc<NextApiRequest, NextApiResponse>({
  onError(error, req, res) {
      res.status(500).json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
      res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
})
.use(logger) // use middleware
.post(async(req:ExtendedRequest, res)=>{ 
  console.log(req.body) 
  let result = await dbclient.user.findMany({
    where: {
        email: {
            contains: req.body.email
        }
    }
  })
  // check if this username is exits
  if(result.length != 0){
    res.status(406).json({error: 'user exits'}) 
  }else{
    try{
      const newUser = await dbclient.user.create({
        data: req.body,
      })
      res.status(200).json({success:`user ${newUser.email} registered`})
    }catch(e){
      console.log(e)
      res.status(418).json({error: e})
    }
  }
})
.get(async(req:ExtendedRequest, res)=>{
  try{
    const users = await dbclient.user.findMany()
    res.status(200).json(users)
  }catch(e){
    console.log(e)
    res.status(418).json({error: e})
  }
})


export default handler;