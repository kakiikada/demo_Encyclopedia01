import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './styles/App.css'

function App() {
  const [count, setCount] = useState(0)
  // メニュー開閉
  const [isExplanationOpen, setIsExplanationOpen] = useState(false)
  const [isBookOpen, setIsBookOpen] = useState(false)
  // 魚のクリック処理
  const [fishHistory, setFishHistory] = useState<string[]>([]) //履歴
  const [fishCollection, setFishCollection] = useState<Record<string, number>>({}) //図鑑
  const fishList = ["アジ", "マグロ", "タイ"]
  // ランダムに５匹を選出
  const [tankFish, setTankFish] = useState(() =>
  Array.from({ length: 5 }, () =>
    fishList[Math.floor(Math.random() * fishList.length)]
  )
)

  return (
    <>
      <section>
        {/* header */}
        <div className="header">
          <h1 className="header_title">まほうの水槽</h1>
          <div className="header_Explanation">
            <button className="header_Explanation_title"
            onClick={() => setIsExplanationOpen(!isExplanationOpen)}
            >ポートフォリオ解説</button>
            {/* 説明 */}
            <div className=
            {isExplanationOpen ? ('header_Explanation_content active'):('header_Explanation_content')}
            >
              <div className="Explanation">
                <p className="Explanation_caption">本作品は主にAPI通信とアニメーションの技術力向上と画面設計・制作作業力の習得のために作成したポートフォリオゲームです。</p>
                <p className="Explanation_title">実装スキル</p>
                <ul className="Explanation_list">
                  <li>API通信</ li>
                  <li>非同期処理</ li>
                  <li>外部データ</ li>
                  <li>条件分岐</ li>
                  <li>動的UI</ li>
                  <li>CSSアニメーション</ li>
                  <li>localStorage</ li>
                  <li>複数データの扱い</ li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <main>
          <div className="mainLayout">
            <div className="mainLayout_monitor">
              {/* 水槽 */}
              <section>
                <div className="monitor">
                  {/* 魚 */}
                  <div className="monitor_feald">
                    <button className="fidh-1"
                      onClick={() => {
                        setFishHistory([...fishHistory, tankFish[0]].slice(-6))
                        setFishCollection({...fishCollection,  [tankFish[0]]: (fishCollection[tankFish[0]] || 0) + 1})
                      }}
                    >{tankFish[0]}</button>
                    <button className="fidh-2"
                      onClick={() => {
                        setFishHistory([...fishHistory, tankFish[1]].slice(-6))
                        setFishCollection({...fishCollection,  [tankFish[1]]: (fishCollection[tankFish[1]] || 0) + 1})
                      }}
                    >{tankFish[1]}</button>
                    <button className="fidh-3"
                      onClick={() => {
                        setFishHistory([...fishHistory, tankFish[2]].slice(-6))
                        setFishCollection({...fishCollection,  [tankFish[2]]: (fishCollection[tankFish[2]] || 0) + 1})
                      }}
                    >{tankFish[2]}</button>
                    <button className="fidh-4"
                      onClick={() => {
                        setFishHistory([...fishHistory, tankFish[3]].slice(-6))
                        setFishCollection({...fishCollection,  [tankFish[3]]: (fishCollection[tankFish[3]] || 0) + 1})
                      }}
                    >{tankFish[3]}</button>
                    <button className="fidh-5"
                      onClick={() => {
                        setFishHistory([...fishHistory, tankFish[4]].slice(-6))
                        setFishCollection({...fishCollection,  [tankFish[4]]: (fishCollection[tankFish[4]] || 0) + 1})
                      }}
                    >{tankFish[4]}</button>
                  </div>
                  {/* 背景 */}
                  <div className="monitor_bg">
                    <div className="monitor_bg_overlay"></div>
                    <div className="seaweed-1"></div>
                    <div className="seaweed-2"></div>
                    <div className="monitor_bg_gradation2"></div>
                    <div className="monitor_bg_gradation"></div>
                  </div>
                </div>
              </section>
              {/* 履歴 */}
              <section>
                <div className="history">
                  <p className="history_title">入手</p>
                  <ul className="history_list">
                  {fishHistory.map((fish, index) => (
                    <li key={index}><button>{fish}</button></li>
                  ))}

                  </ul>
                </div>
              </section>
            </div>
            <div className="mainLayout_menu">
              {/* 図鑑 */}
              <section>
                <div className="menu">
                  <button className="menu_btn"
                  onClick={() => setIsBookOpen(!isBookOpen)}
                  ></button>
                  <div className=
                  {isBookOpen ? ('menu_feald active'):('menu_feald')}
                  >
                    <p className="menu_title">Encyclopedia</p>
                    <ul className="menu_list">
                        {fishList.map((fish) =>
                          fishCollection[fish] >= 1 ? (

                            <li key={fish}><button>{fish}{fishCollection[fish]}匹</button></li>
                          ):(
                            <li key={fish}><button>未取得</button></li>
                          )
                        )}
                    </ul>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
        

      </section>


    </>
  )
}

export default App
