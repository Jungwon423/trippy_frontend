import React, { useEffect, useState, useRef } from 'react'
import { initialNumbersValue, returnSelectedValue } from './helpers'

interface MinuteWheelProps {
  height: number
  value: string
  setValue: React.Dispatch<React.SetStateAction<string>>
}

const MinuteObject = [
  {
    number: '',
    translatedValue: '',
    selected: false,
  },
]

type MinuteObjectType = typeof MinuteObject

const MinuteWheel: React.FC<MinuteWheelProps> = ({
  height,
  value,
  setValue,
}) => {
  //initialNumbersValue(height, 60, parseInt(value.slice(0, 2))),
  const numbers = Array.from({ length: 61 }, (_, i) => i).filter(
    (n) => n % 5 === 0,
  )
  //MinuteObjectType을 사용했어야함.
  const [hours, setHours] = useState<any>(
    initialNumbersValue(height, 48, parseInt(value.slice(0, 2))),
  )
  const mainListRef = useRef<HTMLDivElement>(null)
  const [cursorPosition, setCursorPosition] = useState<number | null>(null)
  const [firstCursorPosition, setFirstCursorPosition] = useState<number | null>(
    null,
  )

  const [currentTranslatedValue, setCurrentTranslatedValue] = useState(
    parseInt(
      initialNumbersValue(height, 60, parseInt(value.slice(3, 6))).filter(
        (item: any) =>
          item.number === value.slice(3, 6) && item.selected === true,
      )[0].translatedValue,
    ),
  )
  const [startCapture, setStartCapture] = useState(false)
  const [showFinalTranslate, setShowFinalTranslate] = useState(false)
  // start and end times
  const [dragStartTime, setDragStartTime] = useState<number | null>(null)
  const [dragEndTime, setDragEndTime] = useState<number | null>(null)
  // drag duration
  const [dragDuration, setDragDuration] = useState<number | null>(null)
  // drag type fast or slow
  const [dragType, setDragType] = useState<string | null>(null)
  // drag direction
  const [dragDirection, setDragDirection] = useState<string | null>(null)
  // selected number
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null)

  const handleMouseDown = (e: any) => {
    setShowFinalTranslate(false)
    setFirstCursorPosition(e.clientY)
    setStartCapture(true)
    setDragStartTime(performance.now())
  }

  const handleTouchStart = (e: any) => {
    setShowFinalTranslate(false)
    setFirstCursorPosition(e.targetTouches[0].clientY)
    setStartCapture(true)
    setDragStartTime(performance.now())
  }

  const handleMouseUp = (e: any) => {
    setStartCapture(false)
    setCurrentTranslatedValue((prev) => prev + cursorPosition!)
    setShowFinalTranslate(true)
    setDragEndTime(performance.now())
    if (performance.now() - dragStartTime! <= 100) {
      setDragType('fast')
    } else {
      setDragType('slow')
    }

    if (cursorPosition! < 0) {
      setDragDirection('down')
    } else {
      setDragDirection('up')
    }
  }

  const handleMouseLeave = (e: any) => {
    setStartCapture(false)
    setCurrentTranslatedValue((prev) => prev + cursorPosition!)
    setShowFinalTranslate(true)
    setDragEndTime(performance.now())
    if (performance.now() - dragStartTime! <= 100) {
      setDragType('fast')
    } else {
      setDragType('slow')
    }

    if (cursorPosition! < 0) {
      setDragDirection('down')
    } else {
      setDragDirection('up')
    }
  }

  const handleMouseMove = (e: any) => {
    if (startCapture) {
      setCursorPosition(e.clientY - firstCursorPosition!)
    } else {
      setCursorPosition(0)
    }
  }

  const handleTouchMove = (e: any) => {
    if (startCapture) {
      setCursorPosition(e.targetTouches[0].clientY - firstCursorPosition!)
    } else {
      setCursorPosition(0)
    }
  }

  // preview translation
  useEffect(() => {
    if (startCapture) {
      mainListRef.current!.style.transform = `translateY(${
        currentTranslatedValue + cursorPosition!
      }px)`
    }
  }, [cursorPosition])

  // final translation here
  useEffect(() => {
    if (showFinalTranslate) {
      setDragDuration(dragEndTime! - dragStartTime!)
      if (dragEndTime! - dragStartTime! <= 100 && cursorPosition !== 0) {
        let currentValue
        if (dragDirection === 'down') {
          currentValue =
            currentTranslatedValue -
            (120 / (dragEndTime! - dragStartTime!)) * 100
        } else if (dragDirection === 'up') {
          currentValue =
            currentTranslatedValue +
            (120 / (dragEndTime! - dragStartTime!)) * 100
        }
        let finalValue = Math.round(currentValue! / height) * height
        if (finalValue < height * -177) finalValue = height * -177
        if (finalValue > height * 2) finalValue = height * 2

        mainListRef.current!.style.transform = `translateY(${finalValue}px)`
        setCurrentTranslatedValue(finalValue)
      }
      if (dragEndTime! - dragStartTime! > 100 && cursorPosition !== 0) {
        let finalValue = Math.round(currentTranslatedValue / height) * height
        if (finalValue < height * -177) finalValue = height * -177
        if (finalValue > height * 2) finalValue = height * 2
        mainListRef.current!.style.transform = `translateY(${finalValue}px)`
        setCurrentTranslatedValue(finalValue)
      }
      setCursorPosition(0)
    }
  }, [showFinalTranslate])

  // return to default position after drag end (handleTransitionEnd)
  const handleTransitionEnd = (e: any) => {
    returnSelectedValue(height, 60).map((item: any) => {
      if (parseInt(item.translatedValue) === currentTranslatedValue) {
        setSelectedNumber(item.arrayNumber)
        setValue((prev) => `${prev.slice(0, 2)}:${item.number}`)
        setHours(() => {
          const newValue = initialNumbersValue(height, 60).map((hour: any) => {
            if (
              hour.number == item.number &&
              hour.translatedValue == currentTranslatedValue
            ) {
              return {
                ...hour,
                selected: true,
              }
            }
            return hour
          })
          return newValue
        })
      }
    })
  }

  // handle click to select number
  const handleClickToSelect = (e: any) => {
    if (cursorPosition === 0) {
      setCurrentTranslatedValue(parseInt(e.target.dataset.translatedValue))
    }
  }

  const isFastCondition = showFinalTranslate && dragType === 'fast'
  const isSlowCondition = showFinalTranslate && dragType === 'slow'

  /* ***************************   handle wheel scroll ************************* */

  const handleWheelScroll = (e: any) => {
    if (e.deltaY > 0) {
      if (currentTranslatedValue < height * 2) {
        setCurrentTranslatedValue((prev) => prev + height)
      }
    } else if (currentTranslatedValue > height * -177) {
      setCurrentTranslatedValue((prev) => prev - height)
    }
  }

  return (
    <div
      className="react-ios-time-picker-minute"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ height: height * 5 }}
      onWheel={handleWheelScroll}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
    >
      {/* <PickerEffects height={height} /> */}
      <div
        ref={mainListRef}
        className={`${
          isFastCondition === true && 'react-ios-time-picker-fast'
        } ${isSlowCondition === true && 'react-ios-time-picker-slow'}`}
        onTransitionEnd={handleTransitionEnd}
        style={{ transform: `translateY(${currentTranslatedValue}px)` }}
      >
        {hours.map((hourObj, index) => (
          <div
            key={index}
            className="react-ios-time-picker-cell-minute"
            style={{ height: `${height}px` }}
          >
            <div
              className={`react-ios-time-picker-cell-inner-minute${
                hourObj.selected
                  ? ' react-ios-time-picker-cell-inner-selected'
                  : ''
              }`}
              onClick={handleClickToSelect}
              data-translated-value={hourObj.translatedValue}
            >
              {hourObj.number}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MinuteWheel
