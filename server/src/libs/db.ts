import mongoose from 'mongoose'
import { env } from './env-check'

const connectDB = async () => {
  try {
    await mongoose.connect(env.DB_URL as string)
    console.log('\n--------------------------')
    console.log(`⚙️  Database connected! `)
  } catch (err) {
    console.error('❌ Database connection error:', err)
    process.exit(1)
  }
}

export const db = mongoose.connection.useDb('english_education')
export default connectDB
