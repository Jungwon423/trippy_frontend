import router from 'next/router'
import MyNavbar from '../search_components/MyNavbar'
import CircleListItem from '../survey_components/CircleList'
import { useState } from 'react'
import WhoSurvey from '../survey_components/WhoSurvey'

export default function SurveyPage() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const handleItemClick = (index: number) => {
    setSelectedIndex(index)
  }
  const items = [
    '어디로 떠나시나요?',
    '언제 가시나요?',
    '여행 스타일은 어떻게 되시나요?',
  ]

  return (
    <div className="h-screen">
      <MyNavbar></MyNavbar>

      <div className="flex flex-row w-screen">
        <div className="hidden md:block overflow-hidden w-0 md:w-1/3 md:min-w-1/3 relative p-8">
          <button onClick={() => router.back}>
            <div className="flex justify-center items-center bg-slate-300 h-8 w-8 rounded-full mb-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="indigo"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </div>
          </button>
          <div className="pt-20 flex flex-col space-y-16">
            {items.map((item, index) => (
              <CircleListItem
                key={index}
                text={item}
                onClick={() => handleItemClick(index)}
                isSelected={selectedIndex === index}
              />
            ))}
          </div>
        </div>
        {selectedIndex == 0 ? <WhoSurvey /> : null}
        {selectedIndex == 1 ? <WhoSurvey /> : null}
        <div>달력 만들기</div>
      </div>
    </div>
  )
}
