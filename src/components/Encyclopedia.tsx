import { useState } from "react"

import type { Fish } from "../data/fishData"

import no_image from "../assets/no_image.png"
import no_icon from "../assets/no_icon.png"

type EncyclopediaProps = {
    fishData: Fish[]
    fishCollection: Record<string, number> 
    bookPage: number | null
    // 図鑑のページネーション
    setBookPage: React.Dispatch<React.SetStateAction<number | null>>
}


export default function Encyclopedia({
  fishData,
  fishCollection,
  bookPage,
  setBookPage,
}: EncyclopediaProps) {
  const [isBookOpen, setIsBookOpen] = useState(false)

  const selectedFish =
    bookPage === null ? undefined : fishData[bookPage]

  return (
      <section>
        {/* 図鑑 */}
        <div className="menu">
            <button className="menu_btn"
            onClick={() => setIsBookOpen(!isBookOpen)}
            ></button>
            <div className=
            {isBookOpen ? "menu_feald active" : "menu_feald"}
            onClick={() => setIsBookOpen(!isBookOpen)}
            >
                <div className="menuFeald" onClick={(e) => e.stopPropagation()}>
                    <p className="menuFeald_title">Encyclopedia</p>
                    <ul className="menuFeald_list">
                        {fishData.map((fish, index) =>
                            fishCollection[fish.name] >= 1 ? (
                                <li key={fish.name}><button
                                onClick={() => setBookPage(index)}
                                className={
                                index === bookPage ? "active" : ""
                                }
                            >
                            <img src={fish.icon} alt={fish.name} />
                            </button></li>
                            ):(
                                <li key={fish.name}><div><img src={no_icon} alt="" /></div></li>
                            )
                        )}
                    </ul>
                    <div className="menuFeald_note">
                        <div className="menuFeald_note_img">
                            <img
                            src={selectedFish?.image || no_image}
                            alt={selectedFish?.name || "---"}
                            />
                            <p>※画像の読み込みに数秒ほど時間がかかる場合がございます。</p>
                        </div>
                        <ul className="menuFeald_note_list">
                            <li><h2>名前：{selectedFish?.name || "---"}</h2></li>
                            <li>学名：{selectedFish?.scientificName || "---"}</li>
                            <li className="menuFeald_note_list_family"><p>分類：</p>
                            <div>
                            <p>界：{selectedFish?.classification?.phylum || "---"}</p>
                            <p>目：{selectedFish?.classification?.order || "---"}</p>
                            <p>科：{selectedFish?.classification?.family || "---"}</p>
                            </div>
                            </li>
                            <li>生息地：{selectedFish?.habitat || "---"}</li>
                            <li>入手数：
                            {selectedFish
                                ? fishCollection[selectedFish.name] || 0
                                : "---"}
                            {selectedFish ? "匹" : ""}
                            <div
                            className={
                                !selectedFish
                                ? ""
                                : (fishCollection[selectedFish.name] || 0) >= 100
                                ? "count-100"
                                : (fishCollection[selectedFish.name] || 0) >= 10
                                ? "count-10"
                                : ""
                            }
                            ></div>
                            </li>
                        </ul>
                    </div>                    
                </div>
            </div>
        </div>
    </section>

  )
}