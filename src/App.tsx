import React from 'react'
import Hello from './Hello';
import Print from './print';
// import '@/assets/css/test.module.scss'
import img from '~/images/1.jpg'

const App = () => {
  return (
    <div>
        hello react 1111www2dsd 
        <Hello />
        <button onClick={()=> Print('Hello webpack!')}>print</button>
        <img src={img} alt="" />
    </div>
  )
}

export default App