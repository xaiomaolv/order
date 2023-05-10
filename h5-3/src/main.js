import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {PullRefresh , List , Badge , Lazyload, Empty , Picker, Dialog , Uploader, RadioGroup, Radio, Field, Rate, Tab, Tabs, Toast , DatetimePicker , Popup , Stepper , Icon, DropdownMenu, DropdownItem , Search ,Button, TreeSelect ,Swipe, SwipeItem, Tag, Tabbar, TabbarItem, Cell, CellGroup  } from 'vant';
import vant from 'vant'
import 'vant/lib/index.css';
import './style/flex-move.css' 

const app = createApp(App)
app.use(store)
.use(router)
// .use(vant)
.use(Icon)
.use(DropdownMenu)
.use(DropdownItem)
.use(Search)
.use(Button) 
.use(TreeSelect)
.use(Swipe)
.use(SwipeItem) 
.use(Tag) 
.use(Tabbar) 
.use(TabbarItem) 
.use(Cell) 
.use(CellGroup) 
.use(Stepper) 
.use(Popup) 
.use(DatetimePicker)
.use(Toast)
.use(Tab)
.use(Tabs)
.use(Rate)
.use(Field)
.use(RadioGroup)
.use(Radio)
.use(Uploader)
.use(Dialog)
.use(Empty) 
.use(Picker)
.use(Lazyload) 
.use(Badge) 
.use(List) 
.use(PullRefresh) 
.mount('#app')
