import { useState, useEffect, useRef } from 'react'
import no_image from "./assets/no_image.png"
import './styles/App.css'

function App() {
  const [count, setCount] = useState(0)
  // メニュー開閉
  const [isExplanationOpen, setIsExplanationOpen] = useState(false)
  const [isBookOpen, setIsBookOpen] = useState(false)
  // 魚のクリック処理
  const [fishHistory, setFishHistory] = useState<string[]>([]) //履歴
  const [historyLeaving, setHistoryLeaving] = useState(false) //履歴アニメーション

  const [fishCollection, setFishCollection] = //図鑑
  useState<Record<string, number>>(() => {
    const saved = localStorage.getItem("fishCollection")
    return saved ? JSON.parse(saved) : {}
  })

  // 図鑑のローカルストレージ保存
  useEffect(() => {
    localStorage.setItem(
      "fishCollection",
      JSON.stringify(fishCollection)
    )
  }, [fishCollection])

  const fishList = ["カクレクマノミ", "ベタ", "エンゼルフィッシュ", "ハリセンボン", "ニシキテグリ"]
  // ランダムに５匹を選出


 // 魚の仮データ
  const fishData = [
    {
      name: "カクレクマノミ",
      scientificName: "Amphiprion ocellaris",
      family: "カクレクマノミの分類",
      habitat: "カクレクマノミの生息地",
      // image: clownfish,
    },
    {
      name: "ベタ",
      scientificName: "Betta splendens",
      family: "ベタの分類",
      habitat: "ベタの生息地",
      // image: betta,
    },
    {
      name: "エンゼルフィッシュ",
      scientificName: "Pterophyllum",
      family: "エンゼルフィッシュの分類",
      habitat: "エンゼルフィッシュの生息地",
      // image: betta,
    },
    {
      name: "ハリセンボン",
      scientificName: "Diodon holocanthus",
      family: "フグ目ハリセンボン科ハリセンボン属",
      habitat: "ハリセンボンの生息地",
      // image: betta,
    },
    {
      name: "ニシキテグリ",
      scientificName: "Synchiropus splendidus",
      family: "ネズッポ科コウワンテグリ属ニシキテグリ",
      habitat: "琉球諸島からオーストラリアにかけての太平洋",
      // image: SynchiropusSplendidus,
    },
    // 以下3匹も追加
  ]




  const [tankFish, setTankFish] = useState(() =>
    Array.from({ length: 5 }, () =>
      fishList[Math.floor(Math.random() * fishList.length)]
    )
  )
  // 標示管理
  const timers = useRef<(number | undefined)[]>([])
  const autoHideTimers = useRef<number[]>([])
  const respawnTimers = useRef<number[]>([])
  //自動管理
    // 標示状態管理
  const [fishVisible, setFishVisible] = useState([
    true,
    true,
    true,
    true,
    true
  ])
  // 自動で消えるアニメーション
  const [fishLeaving, setFishLeaving] = useState([
    false,
    false,
    false,
    false,
    false
  ])
  // クリックアニメーション
  const [fishCatching, setFishCatching] = useState([
    false,
    false,
    false,
    false,
    false
  ])
  // 復活アニメーション
  const [fishRespawning, setFishRespawning] = useState([
    false,
    false,
    false,
    false,
    false
  ])
  // 自動削除・自動復活の関数
  const startAutoHideTimer = (index: number) => {
    autoHideTimers.current[index] = window.setTimeout(() => {
      
      // アニメーション開始
      setFishLeaving(prev =>
        prev.map((leaving, i) =>
          i === index ? true : leaving
        )
      )
      autoHideTimers.current[index] = window.setTimeout(() => {
        // 消す処理
        setFishVisible(prev =>
          prev.map((visible, i) =>
            i === index ? false : visible
          )
        )
        // アニメーション終了
        setFishLeaving(prev =>
          prev.map((leaving, i) =>
            i === index ? false : leaving
          )
        )

        // 20秒後に復活
        respawnTimers.current[index] = window.setTimeout(() => {
          const newFish = fishList[Math.floor(Math.random() * fishList.length)]

          // 新しい魚をセット
          setTankFish(prev =>
            prev.map((fish, i) =>
              i === index ? newFish : fish
            )
          )

          // 復活のアニメーション
          setFishRespawning(prev =>
            prev.map((respawning, i) =>
              i === index ? true : respawning
            )
          )

          // 魚の表示
          setFishVisible(prev =>
            prev.map((visible, i) =>
              i === index ? true : visible
            )
          )
          // 復活アニメーションのリセット
          setTimeout(() => {
            setFishRespawning(prev =>
              prev.map((respawning, i) =>
                i === index ? false : respawning
              )
            )
          }, 1000)　//自動削除後に復活までのニメーションの時間


          // 復活したので、また30秒タイマー開始
          startAutoHideTimer(index)
        }, 8000)　//自動消失後に復活するまでの時間

      }, 1000) //自動で消えるアニメーションの時間

    }, 20000) //自動で消えるまでの時間
  }
  // 実際の処理
  useEffect(() => {
    tankFish.forEach((_, index) => {
      startAutoHideTimer(index)
    })
    return () => {
      autoHideTimers.current.forEach(timer => {
        clearTimeout(timer)
      })

      respawnTimers.current.forEach(timer => {
        clearTimeout(timer)
      })
    }
  }, [])
  // クリック
  // 魚の表示・登録の関数
  const catchFish = (index: number) => {
    // アニメーション中はクリックできない
    if (
      fishLeaving[index] ||
      fishCatching[index] ||
      fishRespawning[index]
    ) {
      return
    }
    const fish = tankFish[index]
    // 自動消滅の30秒タイマーをキャンセル
    clearTimeout(autoHideTimers.current[index])
    
    // 履歴に追加
    setFishHistory([...fishHistory, fish].slice(-6))
    setTimeout(() => {

      // 一番古い履歴を消すアニメーション開始
      setHistoryLeaving(true)

      // アニメーション終了後に実際に削除
      setTimeout(() => {
        setFishHistory(prev => {
          const newHistory = [...prev]
          newHistory.shift()
          return newHistory
        })

        setHistoryLeaving(false)
      }, 1000) //履歴削除アニメーション

    }, 6000) //履歴削除時間
    
    // 図鑑に追加
    setFishCollection({
      ...fishCollection,
      [fish]: (fishCollection[fish] || 0) + 1
    })

    // クリックアニメーション開始
    setFishCatching(prev =>
      prev.map((catching, i) =>
        i === index ? true : catching
      )
    )

    // アニメーション終了後に完全に消す
    setTimeout(() => {
      setFishVisible(prev =>
        prev.map((visible, i) =>
          i === index ? false : visible
        )
      )
      // クリックアニメーション初期化
      setFishCatching(prev =>
        prev.map((catching, i) =>
            i === index ? false : catching
          )
        )

      // 完全に消えてから10秒後に復活
      setTimeout(() => {
        const newFish = fishList[Math.floor(Math.random() * fishList.length)]
        // 新しい魚をセット
        setTankFish(prev =>
          prev.map((fish, i) =>
            i === index ? newFish : fish
          )
        )
        // 復活のアニメーション
        setFishRespawning(prev =>
          prev.map((respawning, i) =>
            i === index ? true : respawning
          )
        )
        // 魚の表示
        setFishVisible(prev =>
          prev.map((visible, i) =>
            i === index ? true : visible
          )
        )
        // 復活アニメーションのリセット
        setTimeout(() => {
          setFishRespawning(prev =>
            prev.map((respawning, i) =>
              i === index ? false : respawning
            )
          )
        }, 1000) //クリック後に復活までのアニメーションの時間

        // 復活したので30秒タイマー開始
        startAutoHideTimer(index)

      }, 8000) //クリック後復活までの時間
    }, 1000) //クリックアニメーションの時間
  }

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
                    
                    {fishVisible[0] && (
                    <div className={`
                      ${fishLeaving[0] ? "fish-leaving" : ""}
                      ${fishCatching[0] ? "fish-catching" : ""}
                      ${fishRespawning[0] ? "fish-respawning" : ""}
                    `} >
                      <button className="fish-1"
                        onClick={() => catchFish(0)}
                      >{tankFish[0]}
                        <span class="clickAnimation"></span>
                      </button>
                    </div>
                    )}
                    
                    {fishVisible[1] && (
                    <div className={`
                      ${fishLeaving[1] ? "fish-leaving" : ""}
                      ${fishCatching[1] ? "fish-catching" : ""}
                      ${fishRespawning[1] ? "fish-respawning" : ""}
                    `} >
                      <button className="fish-2"
                        onClick={() => catchFish(1)}
                      >{tankFish[1]}
                        <span class="clickAnimation"></span>
                      </button>
                    </div>
                    )}
                    
                    {fishVisible[2] && (
                    <div className={`
                      ${fishLeaving[2] ? "fish-leaving" : ""}
                      ${fishCatching[2] ? "fish-catching" : ""}
                      ${fishRespawning[2] ? "fish-respawning" : ""}
                    `} >
                      <button className="fish-3"
                        onClick={() => catchFish(2)}
                      >{tankFish[2]}
                        <span class="clickAnimation"></span>
                      </button>
                    </div>
                    )}
                    
                    {fishVisible[3] && (
                    <div className={`
                      ${fishLeaving[3] ? "fish-leaving" : ""}
                      ${fishCatching[3] ? "fish-catching" : ""}
                      ${fishRespawning[3] ? "fish-respawning" : ""}
                    `} >
                      <button className="fish-4"
                        onClick={() => catchFish(3)}
                      >{tankFish[3]}
                        <span class="clickAnimation"></span>
                      </button>
                    </div>
                    )}
                    
                    {fishVisible[4] && (
                    <div className={`
                      ${fishLeaving[4] ? "fish-leaving" : ""}
                      ${fishCatching[4] ? "fish-catching" : ""}
                      ${fishRespawning[4] ? "fish-respawning" : ""}
                    `} >
                      <button className="fish-5"
                        onClick={() => catchFish(4)}
                      >{tankFish[4]}
                        <span class="clickAnimation"></span>
                      </button>
                    </div>
                    )}
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
                    <li
                      key={index}
                      className={index === 0 && historyLeaving ? "history-leaving" : ""}
                    >
                      <button>{fish}</button>
                    </li>
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
                  onClick={() => setIsBookOpen(!isBookOpen)}
                  >
                    <div className="menuFeald" onClick={(e) => e.stopPropagation()}>
                      <p className="menuFeald_title">Encyclopedia</p>
                      <ul className="menuFeald_list">
                          {fishList.map((fish) =>
                            fishCollection[fish] >= 1 ? (

                              <li key={fish}><button>{fish}{fishCollection[fish]}匹</button></li>
                            ):(
                              <li key={fish}><button>未取得</button></li>
                            )
                          )}
                      </ul>
                      <div className="menuFeald_note">
                        <div className="menuFeald_note_img"><img src={fishData[0].image} alt={fishData[0].name} /></div>
                        <ul className="menuFeald_note_list">
                          <li><h2>名前：{fishData[0].name}</h2></li>
                          <li>学名：{fishData[0].scientificName}</li>
                          <li>分類：{fishData[0].family}</li>
                          <li>生息地：{fishData[0].habitat}</li>
                          <li>入手数：{fishCollection[fishData[0].name] || 0}匹</li>
                        </ul>
                      </div>
                    </div>
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
