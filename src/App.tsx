import { useState, useEffect, useRef } from 'react'
import no_image from "./assets/no_image.png"
import no_icon from "./assets/no_icon.png"
import fish_demo from "./assets/fish_demo.png"
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
  // 図鑑のページネーション
  const [bookPage, setBookPage] = useState<number | null>(null)

  // 図鑑のローカルストレージ保存
  useEffect(() => {
    localStorage.setItem(
      "fishCollection",
      JSON.stringify(fishCollection)
    )
  }, [fishCollection])

  const fishList = ["カクレクマノミ", "ベタ", "エンゼルフィッシュ", "ハリセンボン", "ニシキテグリ"]
  // ランダムに５匹を選出

// 
  const [fishApiData, setFishApiData] = useState<any>(null);
  const [fishOccurrenceData, setFishOccurrenceData] = useState<any>(null);
  

  
  // APIで魚のデータを取得
  useEffect(() => {
    // 未選択なら呼ばない
    if (bookPage === null) {
      return;
    }
    // ローカルストレージにデータがあれば呼ばない
    const currentFish = fishData[bookPage];
    if (currentFish?.image && currentFish?.classification?.phylum) {
      return;
    }

    const scientificName = fishData[bookPage]?.scientificName;
    fetch(
      `https://api.gbif.org/v1/species/match?name=${encodeURIComponent(scientificName)}`
    )
    .then((response) => response.json())
    .then((data) => {
      setFishApiData(data);
      const classification = {
        phylum: data.phylum,
        order: data.order,
        family: data.family,
      };
      setFishData((prev) =>
        prev.map((fish) =>
          fish.scientificName === scientificName
          ? { ...fish, classification: classification }
          : fish
        )
      );

      return fetch(
        `https://api.gbif.org/v1/occurrence/search?taxon_key=${data.usageKey}`
      );
    })
    .then((response) => response.json())
    .then((data) => {
      setFishOccurrenceData(data);

      const imageData = data.results?.find(
        (item: any) => item.media?.[1]?.identifier
      );

      const image = imageData?.media?.[0]?.identifier || "";
      setFishData((prev) => {
        const newFishData = prev.map((fish) =>
          fish.scientificName === scientificName
          ? { ...fish, image: image }
          : fish
        );
        return newFishData;
      });
    });
  }, [bookPage]);
  const imageData = fishOccurrenceData?.results?.find(
    (item: any) => item.media?.[0]?.identifier
  );

 // 魚のデータ元
  const initialFishData = [
    {
      name: "カクレクマノミ",
      scientificName: "Amphiprion ocellaris",
      phylum: "",
      order: "",
      family: "",
      habitat: "インド太平洋などのサンゴ礁",
      image: "",
    },
    {
      name: "ベタ",
      scientificName: "Betta splendens",
      phylum: "",
      order: "",
      family: "",
      habitat: "原種は東南アジアの淡水域",
      image: "",
    },
    {
      name: "エンゼルフィッシュ",
      scientificName: "Pterophyllum scalare",
      phylum: "",
      order: "",
      family: "",
      habitat: "アマゾン川流域を中心とした南アメリカ北部",
      image: "",
    },
    {
      name: "ハリセンボン",
      scientificName: "Diodon holocanthus",
      phylum: "",
      order: "",
      family: "",
      habitat: "全世界の熱帯から温帯、浅い海の岩礁、サンゴ礁、砂底",
      image: "",
    },
    {
      name: "ニシキテグリ",
      scientificName: "Synchiropus splendidus",
      phylum: "",
      order: "",
      family: "",
      habitat: "琉球諸島からオーストラリアにかけての太平洋の珊瑚礁帯",
      image: "",
    },
    // ...
  ];
  // ローカルストレージ管理
  const [fishData, setFishData] = useState(() => {
    const savedFishData = localStorage.getItem("fishData");

    if (savedFishData) {
      return JSON.parse(savedFishData);
    }

    return initialFishData;
  });

  // api追加配列
  const [tankFish, setTankFish] = useState(() =>
    Array.from({ length: 5 }, () =>
      fishList[Math.floor(Math.random() * fishList.length)]
    )
  )

  // apiデータをローカルストレージに保存
  useEffect(() => {
    localStorage.setItem("fishData", JSON.stringify(fishData));
  }, [fishData]);

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
          <h1 className="header_title">ふしぎな水槽</h1>
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
                <p>魚をクリック（タップ）すると捕まえることができます。<br />右下の図鑑アイコンで、捕まえた魚の情報と入手個数を確認できます。入手個数が一定数（１０個など）を超えると、図鑑内テキストに王冠マークがつきます。<br />捕まえた魚は消失しますが、少し待つと復活します。</p>
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
            <div className="header_Explanation_overlay" onClick={() => setIsExplanationOpen(!isExplanationOpen)}></div>
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
                        <img src={fish_demo} alt="" />
                        <span className="clickAnimation"></span>
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
                        <img src={fish_demo} alt="" />
                        <span className="clickAnimation"></span>
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
                        <img src={fish_demo} alt="" />
                        <span className="clickAnimation"></span>
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
                        <img src={fish_demo} alt="" />
                        <span className="clickAnimation"></span>
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
                        <img src={fish_demo} alt="" />
                        <span className="clickAnimation"></span>
                      </button>
                    </div>
                    )}
                  </div>
                  {/* 背景 */}
                  <div className="monitor_bg">
                    <div className="monitor_bg_overlay"></div>
                    <div className="bubble-2"></div>
                    <div className="bubble-1"></div>
                    <div className="seaweed-2"></div>
                    <div className="seaweed-1"></div>
                    <div className="seaweed-3"></div>
                    <div className="monitor_bg_gradation3"></div>
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
                      <div>{fish}</div>
                    </li>
                  ))}
                  </ul>
                </div>
              </section>
            </div>
          </div>
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
                      {fishList.map((fish, index) =>
                        fishCollection[fish] >= 1 ? (
                          <li key={fish}><button
                          onClick={() => {
                            setBookPage(index)
                          }}
                          className={index === bookPage ? "active" : ""}
                          >{fish}{fishCollection[fish]}匹</button></li>
                        ):(
                          <li key={fish}><div><img src={no_icon} alt="" /></div></li>
                        )
                      )}
                  </ul>
                  <div className="menuFeald_note">
                    <div className="menuFeald_note_img">
                      <img 
                        src={fishData[bookPage]?.image || no_image}
                        alt={bookPage === null ? "---" : fishData[bookPage].name} />
                        <p>※画像の読み込みに数秒ほど時間がかかる場合がございます。</p>
                    </div>
                    <ul className="menuFeald_note_list">
                      <li><h2>名前：{fishData[bookPage]?.name || "---"}</h2></li>
                      <li>学名：{fishData[bookPage]?.scientificName || "---"}</li>
                      <li className="menuFeald_note_list_family"><p>分類：</p>
                      <div>
                        <p>界：{fishData[bookPage]?.classification?.phylum || "---"}</p>
                        <p>目：{fishData[bookPage]?.classification?.order || "---"}</p>
                        <p>科：{fishData[bookPage]?.classification?.family || "---"}</p>
                      </div>
                        </li>
                      <li>生息地：{fishData[bookPage]?.habitat || "---"}</li>
                      <li>入手数：
                        {bookPage === null ? "---" : fishCollection[fishData[bookPage].name] || 0}匹
                        <div
                          className={
                            bookPage === null ? "---" :
                            fishCollection[fishData[bookPage].name]  >= 100 ? 'count-100' :
                            fishCollection[fishData[bookPage].name]  >= 10 ? 'count-10' : ''
                          }
                        ></div>
                        </li>
                    </ul>
                  </div>                    
                </div>
              </div>
            </div>
          </section>
        </main>
      </section>
    </>
  )
}

export default App
