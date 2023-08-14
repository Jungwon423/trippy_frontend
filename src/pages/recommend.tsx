import { useDispatch, useSelector } from 'react-redux'
import {
  initialize,
  handleCurrentPlace,
  setCurrentDay,
  selectUserId,
  selectAttractions,
} from '../slices/recommendSlice'
import Map, {
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
  Source,
  Layer,
} from 'react-map-gl'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { selectAttractionQueryTravelId } from '../slices/imageQuerySlice'
import { AppDispatch } from '../store'
import Image from 'next/image'
import RecommendMap from '../travel_components/RecommendMap'
import 'bootstrap-icons/font/bootstrap-icons.css'
import {
  fetchTravelScheduleAsync,
  selectTravelInfo,
  selectCoordinate,
} from '../slices/travelInfoSlice'
import { RecommendInput } from '../interfaces/recommendInput'
import { PlaceInfo } from '../interfaces/placeInfo'

const RecommendPage = () => {
  const TOKEN =
    'pk.eyJ1IjoiemlnZGVhbCIsImEiOiJjbGtrcGNwdXQwNm1oM2xvZTJ5Z2Q4djk5In0._rw_aFaBfUjQC-tjkV53Aw'
  const [viewport, setViewport] = useState({
    latitude: 37.5665, // 초기 위도, 예시로 서울의 위도를 사용함
    longitude: 126.978, // 초기 경도, 예시로 서울의 경도를 사용함
    zoom: 10, // 초기 줌 레벨
    width: '100vw',
    height: '100vh',
  })
  const dispatch = useDispatch<AppDispatch>()
  const userId: string = useSelector(selectUserId)
  const travelId: string = useSelector(selectAttractionQueryTravelId) // !: travelId is not null
  const travelInfo = useSelector(selectTravelInfo)
  // const showChat = useSelector(selectShowChat)

  useEffect(() => {
    dispatch(initialize())
    const input: RecommendInput = {
      user: userId,
      travel_id: travelId,
    }
    dispatch(fetchTravelScheduleAsync(input))
  }, [])

  const router = useRouter()

  const navigateToTravelPage = () => {
    // TODO : 여행 페이지로 이동
    router.push('/travel')
  }

  let buttonStatus: string = ''
  let buttonColor: string = 'bg-blue-500'

  if (travelInfo.loading === 'pending') {
    buttonStatus = 'loading'
    buttonColor = 'bg-gray-500'
  } else if (travelInfo.loading === 'failed') {
    buttonStatus = 'something wrong'
    buttonColor = 'bg-red-500'
  } else {
    buttonStatus = '다음'
    buttonColor = 'bg-blue-500'
  }

  let buttonClass = `rounded px-4 py-2 font-bold text-white hover:bg-blue-600 ${buttonColor} `

  const attractions: PlaceInfo[][] = useSelector(selectAttractions)

  return (
    <div className="flex flex-row">
      <div className="bg-white w-[700px] min-w-[700px] relative h-screen max-h-screen overflow-hidden">
        <div className="flex flex-row">
          <div className="w-[100px] h-screen flex flex-col">
            <button
              className="flex list-none ml-3 my-5"
              onClick={() => router.push('/')}
            >
              <Image
                src="/assets/logo.png"
                alt="Logo"
                width={10}
                height={10}
                style={{
                  maxWidth: '100%',
                  width: 'auto',
                  height: 'auto',
                }}
              />
              <span className="ml-1 font-bold text-xs font-mono">Trippy</span>
            </button>

            <div className="text-slate-300 text-sm py-5 ml-6 cursor-pointer font-bold hover:text-blue-400">
              Day 1
            </div>
            <div className="text-slate-300 text-sm py-5 ml-6 cursor-pointer font-bold hover:text-blue-400">
              Day 2
            </div>
            <div className="text-slate-300 text-sm py-5 ml-6 cursor-pointer font-bold hover:text-blue-400">
              Day 3
            </div>

            <div className="flex-grow"></div>
            <div className="flex justify-center pl-2 pb-5">
              <button className={buttonClass} onClick={navigateToTravelPage}>
                {buttonStatus}
              </button>
            </div>
          </div>

          <div className="w-full bg-[#FAFAFA] h-screen overflow-y-auto">
            <div className="p-4">
              <div className="flex pt-7 pb-1">
                <div className="pl-4 font-bold text-xl">오사카</div>
                <span className="pt-2 text-gray-500 text-sm font-bold px-2">
                  2023.08.10(화) ~ 2023.08.20(목)
                </span>
              </div>
              {attractions.map((day: PlaceInfo[]) => {
                return day.map((place: PlaceInfo) => {
                  return (
                    <div
                      className="flex flex-row p-3 bg-white shadow-md rounded-xl px-5 my-5 cursor-pointer hover:shadow-indigo-500/40 shadow-slate-200"
                      key={place.name}
                      onClick={() => {
                        dispatch(handleCurrentPlace(place))
                        dispatch(setCurrentDay(attractions.indexOf(day) + 1))
                      }}
                    >
                      <img
                        src={place.image}
                        alt={place.name}
                        width={170}
                        height={170}
                        className="rounded-xl"
                      />
                      <div className="px-3 flex flex-col">
                        <div className="text-base font-bold">{place.name}</div>
                        <div className="flex flex-row pl-1s pt-1">
                          <div className="text-sm font-bold">
                            {place.rating}
                          </div>
                          <i
                            key={place.rating}
                            className="pl-1 bi bi-star-fill text-yellow-400 text-sm"
                          ></i>
                          <span className="font-bold text-blue-300 text-xs pt-0.5 pl-2">
                            명소
                          </span>
                        </div>

                        <div className="pt-1 text-xs text-gray-500">
                          <span className="line-clamp-2 ">
                            {place.location}
                          </span>
                        </div>
                        <div className="py-3 text-gray-700 text-sm">
                          {place.summary?.overview}
                        </div>
                      </div>

                      {/* {place.thought} */}
                    </div>
                  )
                })
              })}
            </div>
          </div>
        </div>
      </div>
      <RecommendMap></RecommendMap>
    </div>
  )
}

export default RecommendPage
