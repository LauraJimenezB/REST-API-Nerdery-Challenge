import express from 'express'

const app = express()
const port: string | number = process.env.PORT || 3000

app.get('/', (req: any, res: any) => {
  res.send('hello')
})

app.listen(port, () => console.log(`App listening on PORT ${port}`))
