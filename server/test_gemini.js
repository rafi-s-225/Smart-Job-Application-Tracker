const dotenv = require('dotenv')
dotenv.config()
const { GoogleGenerativeAI } = require('@google/generative-ai')

async function test() {
  const apiKey = (process.env.GEMINI_API_KEY || '').trim()
  const genAI = new GoogleGenerativeAI(apiKey)
  
  const testModels = [
    'gemini-flash-latest',
    'gemini-flash-lite-latest',
    'gemini-3.6-flash',
    'gemini-3.5-flash',
    'gemini-3.1-flash-lite',
    'gemini-2.0-flash-001',
    'gemma-4-31b-it'
  ]

  for (const m of testModels) {
    try {
      console.log(`Testing model ${m}...`)
      const model = genAI.getGenerativeModel({ model: m })
      const res = await model.generateContent('Say hello in 3 words.')
      console.log(`🎉 SUCCESS WITH MODEL [${m}]:`, res.response.text().trim())
      return m
    } catch (err) {
      console.error(`FAILED [${m}]:`, err.message.substring(0, 120))
    }
  }
}

test()
