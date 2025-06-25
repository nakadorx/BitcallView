export type CardListData = {
  title?: string
  description?: string
  video?: string
  poster?: string
  withContent?: boolean
  iconContent?: React.ReactNode
  CardCustomContent?: React.ReactNode
}

export type CardListProps = {
  data: CardListData[]
  title?: string
  subtitle?: string
  activeIndexCard?: number
  setActiveIndexCard?: (index: number) => void
  hideSelector?: boolean
  listIsInclined?: boolean
  cardContainerClassName?: string
  containerClassName?: string
  headerExtraContent?: React.ReactNode
}

export type RenderCardListProps = {
  indicatorStyle: { top: number; height: number }
  data: CardListData[]
  handleClick: (index: number) => void
  activeIndexCard?: number
  itemRefs: React.RefObject<HTMLDivElement[]>
  hideSelector?: boolean
  listIsInclined?: boolean
  cardContainerClassName?: string
  containerClassName?: string
}

export type VideoCardListProps = {
  data: CardListData[]
  title?: string
  withContent?: boolean
}

export type SCardProps = {
  index?: number
  handleClick?: (index: number) => void
  activeIndex?: number
  children?: React.ReactNode
  itemRefs: React.RefObject<HTMLDivElement[]>
  title?: string
  description?: string
  iconContent?: React.ReactNode
  activeOnHover?: boolean
  cardContainerClassName?: string
  enableFloatingAnimation?: boolean
}
