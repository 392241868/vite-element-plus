<template>
    <div class='layout flex h-screen'>
        <div
            class='layout-sidebar-mask fixed w-screen h-screen bg-black bg-opacity-25 z-20'
            :class='{"hidden": menubar.status !== 2 }'
            @click='changeCollapsed'
        />
        <div
            class='layout-sidebar flex flex-col bg-menubar h-screen transition-width duration-200 z-30'
            :class='{ 
                "w-64": menubar.status === 0 || menubar.status === 2, 
                "w-0": menubar.status === 3, 
                "w-16": menubar.status === 1, 
                "absolute": menubar.status === 2, 
            }'
        >
            <div class='layout-sidebar-logo flex h-12 bg-logo text-white relative z-10 flex-center'>
                {{ menubar.status === 0 || menubar.status === 2 ? 'hsianglee' : (menubar.status === 1 ? 'lee' : '') }}
            </div>
            <div class='layout-sidebar-menubar flex flex-1 overflow-hidden'>
                <layout-menubar />
            </div>
        </div>
        <div class='layout-main flex flex-1 flex-col overflow-x-hidden overflow-y-auto'>
            <div class='layout-main-navbar flex justify-between items-center h-12 shadow-sm border-b border-gray-100'>
                <layout-navbar />
            </div>
            <div class='layout-main-tags h-10 leading-10 overflow-hidden shadow text-sm text-gray-600 px-3 position z-10'>
                <layout-tags />
            </div>
            <div class='layout-main-content flex-1 overflow-hidden'>
                <layout-content />
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import { defineComponent, onMounted } from 'vue'
import LayoutContent from '/@/layout/components/content.vue'
import LayoutMenubar from '/@/layout/components/menubar.vue'
import LayoutNavbar from '/@/layout/components/navbar.vue'
import LayoutTags from '/@/layout/components/tags.vue'
import { useStore } from '/@/store/index'
import throttle from '/@/utils/throttle'

export default defineComponent ({
    name: 'Layout',
    components: {
        LayoutContent,
        LayoutMenubar,
        LayoutNavbar,
        LayoutTags
    },
    setup() {
        const store = useStore()
        const changeDeviceWidth = ()=>store.commit('layout/changeDeviceWidth')
        const changeCollapsed = ()=>store.commit('layout/changeCollapsed')
        onMounted(()=>{
            changeDeviceWidth()
            const throttleFn = throttle(300)
            let throttleF = async function() {
                await throttleFn()
                changeDeviceWidth()
            }
            window.addEventListener('resize', throttleF, true)
        })
        return {
            menubar: store.state.layout.menubar,
            changeCollapsed
        }
    }
})
</script>

<style>
.layout-sidebar-menubar .el-menu{
    border-right: 0;
}
.layout-sidebar-menubar .el-scrollbar,
.layout-main-content .el-scrollbar{
    height: 100%;
}
.layout-sidebar-menubar .el-scrollbar .el-scrollbar__wrap,
.layout-main-content .el-scrollbar .el-scrollbar__wrap{
    overflow-y: scroll;
    overflow-x: hidden;
}
</style>