import { useState, useEffect, useRef } from 'react'

import { initialFishData } from "./data/fishData"
import Encyclopedia from "./components/Encyclopedia"

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

  // const fishList = ["カクレクマノミ", "ベタ", "エンゼルフィッシュ", "ハリセンボン", "ニシキテグリ"]
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

  // ローカルストレージ管理
  const [fishData, setFishData] = useState(() => {
    const savedFishData = localStorage.getItem("fishData");

    if (savedFishData) {
      return JSON.parse(savedFishData);
    }

    return initialFishData;
  });

  // api追加配列
  // 確率の関数
  const getRandomFish = () => {
    const totalProbability = fishData.reduce(
      (sum, fish) => sum + fish.probability,
      0
    )

    let random = Math.random() * totalProbability

    for (const fish of fishData) {
      random -= fish.probability

      if (random < 0) {
        return fish
      }
    }

    return fishData[fishData.length - 1]
  }
  // 魚をランダムに抽選
  const [tankFish, setTankFish] = useState(() =>
    Array.from({ length: 5 }, () => getRandomFish())
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
          const newFish = getRandomFish();

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


          // 復活したので、またタイマー開始
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
    // 自動消滅のタイマーをキャンセル
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
      [fish.name]: (fishCollection[fish.name] || 0) + 1
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
        const newFish = getRandomFish();
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
  // 時間実装
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hour = currentTime.getHours();
  const minutes = currentTime.getMinutes();

  let timeZone = "";

  if (hour >= 6 && hour < 10) {
    timeZone = "morning";
  } else if (hour >= 10 && hour < 18) {
    timeZone = "day";
    // if(minutes >= 0 && minutes < 34){
    //   timeZone = "day";
    // }else{
    //   timeZone = "evening";
    // }

  } else if (hour >= 18 && hour < 20) {
    timeZone = "evening";
  } else {
    timeZone = "night";
  }


  return (
    <>
      <section>
        {/* header */}
        <div className="header">


          <h1 className="header_title">ふしぎな水槽</h1>
          <div className="header_time">
            {/* 時間表示 */}
            {currentTime.getHours().toString().padStart(2, "0")}
            <span className="header_time_colon">:</span>
            {currentTime.getMinutes().toString().padStart(2, "0")}
          </div>
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
                <ul className="Explanation_list">
                  <li>魚をクリック（タップ）すると捕まえることができます。（クリックの際、簡易エフェクトが表示されます）</li>
                  <li>右下の図鑑アイコンで、捕まえた魚の情報と入手個数を確認できます。入手個数が一定数（１０個など）を超えると、図鑑内テキストに王冠マークがつきます。</li>
                  <li>捕まえた魚は消失しますが、少し待つと復活します。</li>
                  <li>現在時間が「6時」「10時」「18時」「20時」のタイミングで背景色が変化します。</li>
                </ul>
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
                      >
                      <img
                        src={tankFish[0].illust}
                        alt={tankFish[0].name}
                        />
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
                      >
                      <img
                        src={tankFish[1].illust}
                        alt={tankFish[1].name}
                        />
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
                      >
                      <img
                        src={tankFish[2].illust}
                        alt={tankFish[2].name}
                        />
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
                      >
                      <img
                        src={tankFish[3].illust}
                        alt={tankFish[3].name}
                        />
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
                      >
                      <img
                        src={tankFish[4].illust}
                        alt={tankFish[4].name}
                        />
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
                    <div className="monitor_bg_gradation3" data-time={timeZone} ></div>
                    <div className="monitor_bg_gradation2" data-time={timeZone} ></div>
                    <div className="monitor_bg_gradation" data-time={timeZone} ></div>
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
                      <img src={fish.icon} alt={fish.name} />
                    </li>
                  ))}
                  </ul>
                </div>
              </section>
            </div>
          </div>
          {/* 図鑑 */}
          <Encyclopedia
            fishData={fishData}
            fishCollection={fishCollection}
            bookPage={bookPage}
            setBookPage={setBookPage}
          />

        </main>
      </section>
    </>
  )
}

export default App
