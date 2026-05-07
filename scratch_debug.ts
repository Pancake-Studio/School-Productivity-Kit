import { masterDb } from "./lib/db"

async function debug() {
  console.log("Using MASTER_DATABASE_URL:", process.env.MASTER_DATABASE_URL)
  const users = await masterDb.globalUser.findMany()
  console.log("Global Users:", users)
  
  const schools = await masterDb.school.findMany()
  console.log("Schools:", schools)

  const codes = await masterDb.schoolAccessCode.findMany()
  console.log("Access Codes:", codes)
}

debug().catch(console.error)
