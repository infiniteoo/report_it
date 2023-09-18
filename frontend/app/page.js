import axios from 'axios'

export default function Home() {
  // axios get request to get all reports
  axios.get('http://localhost:7777/').then((res) => {
    console.log(res.data)
  })

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24"></main>
  )
}
