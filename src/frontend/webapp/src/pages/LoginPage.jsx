import { useState } from 'react'
import { LoremIpsum } from "@/components/LoremIpsum"

function LoginPage() {
  const [count, setCount] = useState(0)

  return (
    <div className="">
      <LoremIpsum />
      <LoremIpsum />
      <LoremIpsum />
      <LoremIpsum />

      
    </div>
  )
}

export default LoginPage
