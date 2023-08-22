import Image from 'next/image'
import React, { useRef, useEffect, useState, useCallback } from 'react'

import 'react-time-picker/dist/TimePicker.css'
import TimePicker from 'react-ios-time-picker'
import TimePicker2 from '../components/TimePicker2'
//import TimePicker from 'react-ios-time-picker';
import dynamic from 'next/dynamic'

const DynamicComponentWithNoSSR = dynamic(
  () => import('../components/TimePicker2'),
  { ssr: false },
)

const TestPage: React.FC = () => {
  const [time, setTime] = useState<Date>(new Date())

  const handleChange = (newTime: Date): void => {
    setTime(newTime)
  }

  return (
    <>
      <DynamicComponentWithNoSSR></DynamicComponentWithNoSSR>
    </>
  )
}

export default TestPage
