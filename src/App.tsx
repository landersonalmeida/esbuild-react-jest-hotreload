import React, { useState } from 'react'

import cloud from './cloud.svg'
import image from './image.png'

const App = () => {
  const [] = useState('')

  return (
    <>
      <h1 role={'heading'}>Hello Esbuild! :)</h1>

      <img src={image} />
      <img src={cloud} width={300} />
    </>
  )
}

export default App
