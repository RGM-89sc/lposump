import loadable from '@loadable/component';

export default [
  {
    path: '/',
    exact: true,
    name: 'overview',
    icon: 'dashboard',
    label: '概览',
    component: loadable(() => import('./scenes/Overview/index'))
  },
  {
    path: '/plan/',
    exact: false,
    name: 'plan',
    icon: 'schedule',
    label: '方案',
    component: loadable(() => import('./scenes/Plan/index'))
  },
  {
    path: '/application/',
    exact: false,
    name: 'application',
    icon: 'appstore',
    label: '应用',
    component: loadable(() => import('./scenes/Application/index'))
  },
  {
    path: '/setting/',
    exact: false,
    name: 'setting',
    icon: 'setting',
    label: '设置',
    component: loadable(() => import('./scenes/Setting/index'))
  }
];