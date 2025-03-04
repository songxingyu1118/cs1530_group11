import { useState } from 'react'
import '@/css/HomePage.scss'

import { Button } from "@/components/ui/Button"
import { LoremIpsum } from "@/components/LoremIpsum"

function HomePage() {
  const [count, setCount] = useState(0)

  return (
    <div className="home-container">
      Hello WORLD
      <a className="mx-4" href="/login"><Button>CLICK!</Button></a>
      
      <div className="">
        <LoremIpsum />
      </div>
      
      
    </div>
  )
}

export default HomePage
