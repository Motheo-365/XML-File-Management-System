//Motheo Morena u24666981
import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '@/pages/Files.vue'
import UploadPage from '@/pages/Upload.vue'
import ViewFile from '@/pages/viewFile.vue'
import NotFound from '@/pages/NotFound.vue'

const routes = [
  // Home → list ALL files
  { path: '/', component: HomePage },

  { path: '/upload', component: UploadPage },

  {
    path: '/files/:type(xml|xslt|xsd)/:name',
    name: 'viewFile',
    component: ViewFile,
    props: true
  },

  {
    path: '/preview/html',
    name: 'htmlPreview',
    component: () => import('@/pages/HtmlPreview.vue')
  },

  {
    path: '/files/:type(xml|xslt|xsd)',
    name: 'filesByType',
    component: HomePage,
    props: true
  },

  { path: '/:pathMatch(.*)*', component: NotFound }
]

export default createRouter({
  history: createWebHistory(),
  routes
})