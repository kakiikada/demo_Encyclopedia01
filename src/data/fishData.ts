import fish01 from "../assets/fish-01.png"
import fish02 from "../assets/fish-02.png"
import fish03 from "../assets/fish-03.png"
import fish04 from "../assets/fish-04.png"
import fish05 from "../assets/fish-05.png"

import fish_icon01 from "../assets/fish_icon-01.png"
import fish_icon02 from "../assets/fish_icon-02.png"
import fish_icon03 from "../assets/fish_icon-03.png"
import fish_icon04 from "../assets/fish_icon-04.png"
import fish_icon05 from "../assets/fish_icon-05.png"

export type Fish = {
  name: string
  scientificName: string
  habitat: string
  image: string
  illust: string
  icon: string
  probability: number

  // APIから取得した分類情報
  classification?: {
    phylum?: string
    order?: string
    family?: string
  }
}
 // 魚のデータ元
export const initialFishData: Fish[] = [
{
    name: "カクレクマノミ",
    scientificName: "Amphiprion ocellaris",
    habitat: "インド太平洋などのサンゴ礁",
    image: "",
    illust: fish01,
    icon: fish_icon01,
    probability: 50,
    classification: {
        phylum: "...",
        order: "...",
        family: "..."
    },
},
{
    name: "ベタ",
    scientificName: "Betta splendens",
    habitat: "原種は東南アジアの淡水域",
    image: "",
    illust: fish02,
    icon: fish_icon02,
    probability: 17,
    classification: {
        phylum: "...",
        order: "...",
        family: "..."
    }
},
{
    name: "エンゼルフィッシュ",
    scientificName: "Pterophyllum scalare",
    habitat: "アマゾン川流域を中心とした南アメリカ北部",
    image: "",
    illust: fish03,
    icon: fish_icon03,
    probability: 13,
    classification: {
        phylum: "...",
        order: "...",
        family: "..."
    }
},
{
    name: "ハリセンボン",
    scientificName: "Diodon holocanthus",
    habitat: "全世界の熱帯から温帯、浅い海の岩礁、サンゴ礁、砂底",
    image: "",
    illust: fish04,
    icon: fish_icon04,
    probability: 12,
    classification: {
        phylum: "...",
        order: "...",
        family: "..."
    }
},
{
    name: "ニシキテグリ",
    scientificName: "Synchiropus splendidus",
    habitat: "琉球諸島からオーストラリアにかけての太平洋の珊瑚礁帯",
    image: "",
    illust: fish05,
    icon: fish_icon05,
    probability: 8,
    classification: {
        phylum: "...",
        order: "...",
        family: "..."
    }
},
// ...
];










