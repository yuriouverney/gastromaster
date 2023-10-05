import { ProfileTypes } from 'src/app/shared/enums/profile-types.enum';
import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
    sectionId: '',
  },
  {
    displayName: 'Inicio',
    iconName: 'layout-dashboard',
    route: '/index',
    sectionId: 'section-start',
  },
  {
    displayName: 'Promoções',
    iconName: 'tags',
    route: '/index',
    sectionId: 'section-promotion',
  },
  {
    displayName: 'Cardápio',
    iconName: 'tools-kitchen',
    route: '/index',
    sectionId: 'section-menu',
  },
  {
    displayName: 'Sobre nós',
    iconName: 'home-question',
    route: '/index',
    sectionId: 'section-description',
  },
  {
    displayName: 'Reservar Mesa',
    iconName: 'calendar-stats',
    route: '/index',
    sectionId: 'section-book-a-table',
  },
  {
    navCap: 'Administração',
    permissions: [ProfileTypes.ADMIN, ProfileTypes.MANAGER],
  },
  {
    displayName: 'Pedidos do Sistema',
    iconName: 'shopping-cart',
    route: '/admin/orders',
    permissions: [ProfileTypes.ADMIN, ProfileTypes.MANAGER],
  },
  {
    displayName: 'Configurações',
    iconName: 'settings',
    route: '/admin/setting',
    permissions: [ProfileTypes.ADMIN],
  },
  {
    displayName: 'Usuários do Sistema',
    iconName: 'users',
    route: '/admin/users',
    permissions: [ProfileTypes.ADMIN],
  },
  {
    displayName: 'Reservas do Sistema',
    iconName: 'table',
    route: '/admin/reservations',
    permissions: [ProfileTypes.ADMIN, ProfileTypes.MANAGER],
  },
  {
    displayName: 'Categorias do Sistema',
    iconName: 'category',
    route: '/admin/categories',
    permissions: [ProfileTypes.ADMIN],
  },
  {
    displayName: 'Produtos do Sistema',
    iconName: 'pizza',
    route: '/admin/products',
    permissions: [ProfileTypes.ADMIN],
  },
  {
    displayName: 'Cupons do Sistema',
    iconName: 'wallet',
    route: '/admin/coupons',
    permissions: [ProfileTypes.ADMIN],
  },
  {
    displayName: 'Relatórios do Sistema',
    iconName: 'wallet',
    route: '/admin/charts',
    permissions: [ProfileTypes.ADMIN],
  },
];
