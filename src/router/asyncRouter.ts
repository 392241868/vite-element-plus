/*
 * @Author: zyj
 * @Date: 2020-12-26 15:12:46
 * @LastEditors: zyj
 * @LastEditTime: 2021-01-06 15:36:00
 * @Description: file content
 * @FilePath: /vite-element-plus/src/router/asyncRouter.ts
 */
import { IMenubarList } from '/@/type/store/layout'
import { listToTree } from '/@/utils/listToTree'
import { store } from '/@/store/index'
const components = {
    Layout: () => import('/@/layout/index.vue'),
    404: () => import('/@/views/404.vue'),
    Workplace: () => import('/@/views/Dashboard/Workplace.vue'),
    ProjectList: () => import('/@/views/Project/ProjectList.vue'),
    ProjectDetail: () => import('/@/views/Project/ProjectDetail.vue'),
    ProjectImport: () => import('/@/views/Project/ProjectImport.vue'),
    SecondNav: () => import('/@/views/Nav/SecondNav/Index.vue'),
    ThirdNav: () => import('/@/views/Nav/SecondNav/ThirdNav/Index.vue'),
    SecondText: () => import('/@/views/Nav/SecondText/Index.vue'),
    ThirdText: () => import('/@/views/Nav/SecondText/ThirdText/Index.vue'),
    OpenWindowTest: () => import('/@/views/Components/OpenWindowTest.vue'),
    CardListTest: () => import('/@/views/Components/CardListTest.vue'),
    TableSearchTest: () => import('/@/views/Components/TableSearchTest.vue'),
    VirtualListTest:() => import('/@/views/Components/VirtualListTest.vue')
}

const asyncRouter:Array<IMenubarList> = [
    {
        path: '/:pathMatch(.*)*', 
        name: 'NotFound', 
        component: components['404'],
        meta: {
            title: 'NotFound',
            icon: ''
        }, 
        redirect: '/404',
        hidden: true
    }
]

export const generatorDynamicRouter = (data:Array<IMenubarList>):void => {
    const routerList:Array<IMenubarList> = listToTree(data, 0)
    asyncRouter.forEach(v=>routerList.push(v))
    const f = (data:Array<IMenubarList>, pData:IMenubarList|null) => {
        for(let i = 0,len = data.length;i < len;i++){
            const v:IMenubarList = data[i]
            v.component = components[typeof v.component === 'string' && v.component]
            // v.component = components[v.component] || (() => import(`../view${path}.vue`))
            // v.component = () => import(`../view${data[i].path}.vue`)
            if(!v.meta.permission || pData && v.meta.permission.length === 0){
                v.meta.permission = pData && pData.meta && pData.meta.permission ? pData.meta.permission : []
            }
            if(v.children && v.children.length > 0) {
                f(v.children, v)
            }
        }
    }
    f(routerList, null)
    store.commit('layout/setRoutes', routerList)
}