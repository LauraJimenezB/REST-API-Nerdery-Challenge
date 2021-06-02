import express from 'express'

const app = express()

app.get('/', (req: any, res: any) => {
  res.send('hello')
})
const port: string | number = process.env.PORT || 3000
app.listen(port, () => console.log(`App listening on PORT ${port}`))

console.log('aidaa123...')
