// components/Popup.tsx
import React from 'react'
import Image from 'next/image'
import { useEffect } from 'react'
import {
  CityInput,
  fetchCityDetailAsync,
  selectCityDetail,
} from '../slices/cityDetailSlice'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../store'
import { selectCity } from '../slices/travelInfoSlice'
import ButtonWithImage from './ButtonWithImage'

interface PopupProps {
  isOpen: boolean
  onClose: () => void
}

const Popup: React.FC<PopupProps> = ({ isOpen, onClose }) => {
  // const city = useSelector(selectCity)
  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    const cityInput: CityInput = {
      destination: '오사카',
    }
    dispatch(fetchCityDetailAsync(cityInput))
  }, [])
  const cityInfos = useSelector(selectCityDetail)
  console.log(cityInfos.city_detail)
  const cityDetail = cityInfos.city_detail
  let shortestFlightDuration = cityDetail?.shortestFlightInfo?.duration
  const flightText =
    Math.floor(shortestFlightDuration! / 60) +
    '시간 ' +
    (shortestFlightDuration! % 60) +
    '분'
  let splittedVisa = cityDetail?.visaInfo.description.split(',')
  let timeDifference = cityDetail?.timezone.offset! - 540
  let timeDifferenceText = ''
  if (timeDifference == 0) {
    timeDifferenceText = '한국과 같음'
  } else if (timeDifference > 0) {
    timeDifferenceText =
      '한국보다 ' + Math.floor(timeDifference! / 60) + '시간 빠름'
  } else {
    timeDifferenceText =
      '한국보다 ' + Math.floor(timeDifference! / 60) + '시간 느림'
  }
  console.log(cityDetail?.countryInfo.plug[0])
  const frequency = cityDetail?.countryInfo.plug[0].frequency.replace(
    /(\s*)/g,
    '',
  ) //공백제거
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-20">
      {/* {children} */}
      <div className="flex relative bg-white rounded-lg shadow-md px-16 py-16">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-700"
        >
          X
        </button>
        <div className="flex-col w-80 mx-6">
          <div className="text-2xl font-bold">{cityDetail?.name_ko}</div>
          <div className="mb-5 text-xl text-gray-700 font-medium">
            {cityDetail?.name_en}
          </div>
          <div className="text-xs text-gray-500 font-bold">
            {cityDetail?.descriptionInfo.legacy}
          </div>
          <div className="flex pt-1">
            {cityDetail?.weatherRecommend.season ? (
              <ButtonWithImage
                imageSrc="/assets/buttonIcon/calendar.webp"
                text="추천"
                detailText={
                  <div>
                    {cityDetail?.weatherRecommend.season.map((month, index) => (
                      <div className="pl-1 text-[8px]" key={index}>
                        {month}
                      </div>
                    ))}
                  </div>
                }
              />
            ) : null}
            {flightText ? (
              <ButtonWithImage
                imageSrc="/assets/buttonIcon/plane.png"
                text="항공"
                detailText={<div className="pl-1 text-[8px]">{flightText}</div>}
              />
            ) : null}
            {splittedVisa ? (
              <ButtonWithImage
                imageSrc="/assets/buttonIcon/boarding-pass.png"
                text="비자"
                detailText={
                  <div>
                    <div className="text-[7px] text-gray-600 font-bold">
                      {splittedVisa![0]}
                    </div>
                    <div className="pl-1 text-[8px]">{splittedVisa![1]}</div>
                  </div>
                }
              />
            ) : null}
            {cityDetail?.countryInfo.currencyInformation.exchangeRate ? (
              <ButtonWithImage
                imageSrc="/assets/buttonIcon/exchange.png"
                text="환율"
                detailText={
                  <div className="pl-1 text-[8px]">
                    {cityDetail?.countryInfo.currencyInformation.exchangeRate}
                  </div>
                }
              />
            ) : null}
          </div>

          <div className="flex flex-row">
            {timeDifferenceText ? (
              <ButtonWithImage
                imageSrc="/assets/buttonIcon/time-zones.png"
                text="시차"
                detailText={
                  <div className="text-[7px]">{timeDifferenceText}</div>
                }
              />
            ) : null}
            {cityDetail?.priceInfo.shortDescription ? (
              <ButtonWithImage
                imageSrc="/assets/buttonIcon/price-tag.png"
                text="물가"
                detailText={
                  <div>
                    <div className="text-[5px] text-gray-600 font-bold">
                      한국대비
                    </div>
                    <div className="text-[8px]">
                      {cityDetail?.priceInfo.shortDescription}
                    </div>
                  </div>
                }
              />
            ) : null}
            {cityDetail?.countryInfo.plug[0] ? (
              <ButtonWithImage
                imageSrc="/assets/buttonIcon/plug-in.png"
                text="전압"
                detailText={
                  <div>
                    <div className="text-[6px] text-gray-600 font-bold">
                      {frequency}
                    </div>
                    <div className="text-[8px]">
                      {cityDetail?.countryInfo.plug[0].electricPotential}
                    </div>
                  </div>
                }
              />
            ) : null}
            {cityDetail?.language ? (
              <ButtonWithImage
                imageSrc="/assets/buttonIcon/languages.png"
                text="언어"
                detailText={
                  <div>
                    {cityDetail?.language.langList.map((lang, index) => (
                      <div className="pl-1 text-[8px]" key={index}>
                        {lang}
                      </div>
                    ))}
                  </div>
                }
              />
            ) : null}
          </div>
          <div className="pt-1 flex justify-between">
            <button className="flex text-sm px-6 py-2 bg-gray-500 text-white rounded-md">
              도시 정보 더 보기
            </button>
            <button className="flex text-sm px-8 py-2 bg-indigo-500 text-white rounded-md">
              일정 만들기 {'>'}
            </button>
          </div>
        </div>
        <div className="flex bg-white">
          <Image
            // 여기에 클래스 적용
            className="rounded"
            src={cityDetail?.image.photoURL!}
            alt="travel"
            width={350}
            height={350}
            quality={100}
            style={{
              maxWidth: '100%',
              height: 'auto',
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default Popup
