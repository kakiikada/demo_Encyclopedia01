import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './styles/App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section>
        {/* header */}
        <div className="header">
          <h1 className="header_title">まほうの水槽</h1>
          <div className="header_Explanation">
            <button className="header_Explanation_title">ポートフォリオ解説</button>
            {/* 説明 */}
            <div className="header_Explanation_content">
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
                    <button className="fidh-1"></button>
                    <button className="fidh-2"></button>
                    <button className="fidh-3"></button>
                    <button className="fidh-4"></button>
                    <button className="fidh-5"></button>
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
                    <li><button></button></li>
                    <li><button></button></li>
                    <li><button></button></li>
                    <li><button></button></li>
                    <li><button></button></li>
                  </ul>
                </div>
              </section>
            </div>
            <div className="mainLayout_menu">
              {/* 図鑑 */}
              <section>
                <div className="menu">
                  <button className="menu_btn"></button>
                  <ul className="menu_list">
                    <li></li>
                  </ul>
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
