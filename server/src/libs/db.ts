import mongoose from 'mongoose'
import { env } from './env-check'

const connectDB = async () => {
  try {
    await mongoose.connect(
      (env.DB_URL as string) ||
        'mongodb+srv://daeveph:o9iioi091101@twittercluster.osuh4.mongodb.net/english_education?retryWrites=true&w=majority'
    )
    console.log('\n--------------------------')
    console.log(`⚙️  Database connected! `)
  } catch (err) {
    console.error('❌ Database connection error:', err)
    process.exit(1)
  }
}

export const db = mongoose.connection.useDb('english_education')
export default connectDB
