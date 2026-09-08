// Курируемый список иконок.
//
// Отдельным публичным API (`@/shared/ui/icons`) он быть не может:
// правило запрета импортов глубже слайса в eslint.config.js закрывает
// и этот путь, а делать для shared исключение ради косметики значило
// бы ослабить рабочее правило. Поэтому список живёт здесь, а корневой
// index слоя ui подключает его одной строкой.
export { IconArrowUpRight } from './IconArrowUpRight';
export { IconBase, type IconProps } from './IconBase';
export { IconBell } from './IconBell';
export { IconCardPay } from './IconCardPay';
export { IconCart } from './IconCart';
export { IconCheck } from './IconCheck';
export { IconChevronDown } from './IconChevronDown';
export { IconClose } from './IconClose';
export { IconFilter } from './IconFilter';
export { IconGrid } from './IconGrid';
export { IconHeart } from './IconHeart';
export { IconHome } from './IconHome';
export { IconSearch } from './IconSearch';
export { IconStar } from './IconStar';
export { IconTag } from './IconTag';
export { IconTruck } from './IconTruck';
export { IconUser } from './IconUser';
