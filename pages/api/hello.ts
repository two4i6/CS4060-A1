import type { NextApiRequest, NextApiResponse } from 'next'
import nc from "next-connect";
import {prisma, User} from '@prisma/client';
import { PrismaClient } from '@prisma/client'

// a singleton instance of the database client
class DatabaseClient {
    private static instance: DatabaseClient;
    private dbclient: PrismaClient;
    
    private constructor() {
        this.dbclient = new PrismaClient()
    }

    get client():PrismaClient { return this.dbclient;}

    public static getInstance(): DatabaseClient {
        if (!DatabaseClient.instance) {
            DatabaseClient.instance = new DatabaseClient();
        }
        return DatabaseClient.instance;
    }
}

const dbclient = DatabaseClient.getInstance().client;

interface ExtendedRequest extends NextApiRequest {
  body: User
}

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
.use(logger)
.post(async(req:ExtendedRequest, res)=>{
  let newUser:User
  try{
    newUser= await dbclient.user.create({
      data:req.body,
    })
    res.status(200).json({success:`user ${newUser.email} registered`})
  }catch(e){
    await dbclient.user.findMany({
      where: {
          email: {
              contains: req.body.email
          }
      }
    }) !== null ? res.status(406).json({error: 'user exits'}) :
    res.status(418).json({error: e})
  }
})


export default handler;