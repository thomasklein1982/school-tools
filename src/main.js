import { createApp } from 'vue'
import 'primevue/resources/primevue.min.css';
import 'primevue/resources/themes/vela-orange/theme.css';
import './style.css'
import 'primeicons/primeicons.css';
import  * as PrimeVue  from "primevue/config";
import  Button from "primevue/button";
import Checkbox from "primevue/checkbox";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import InputNumber from "primevue/inputnumber";
import InputSwitch from "primevue/inputswitch";
import * as Dialog  from "primevue/dialog";
import Menubar from 'primevue/menubar';
import Sidebar from 'primevue/sidebar';
import Panel from 'primevue/panel';
import Tree from 'primevue/tree';
import Badge from 'primevue/badge';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import Toast from "primevue/toast";
import ConfirmPopup from 'primevue/confirmpopup';
import Splitter from "primevue/splitter";
import SplitterPanel from 'primevue/splitterpanel'
import Slider from "primevue/slider";
import Card from 'primevue/card';
import SelectButton from 'primevue/selectbutton';
import ToggleButton from 'primevue/togglebutton';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Message from "primevue/message";
import Listbox from 'primevue/listbox';
import TextArea from 'primevue/textarea';
import Tooltip from 'primevue/tooltip';
import App from './App.vue'
import { registerSW } from 'virtual:pwa-register'

const updateSW=registerSW({
  onNeedRefresh(){
    let a=confirm("Eine neue Version ist verfügbar. Willst du aktualisieren (empfohlen!)?");
    if(a){
      updateSW();
    }
  },
  onOfflineReady(){
    console.log("offline ready");
  }
});

let app=createApp(App);
app.use(PrimeVue.default);
app.use(ConfirmationService);
app.use(ToastService);
app.directive('tooltip', Tooltip);
app.component('Button',Button);
app.component('Dialog',Dialog.default);
app.component('Checkbox',Checkbox);
app.component('InputText',InputText);
app.component('InputNumber',InputNumber);
app.component('Menubar',Menubar);
app.component('Sidebar',Sidebar);
app.component('Panel',Panel);
app.component('Tree',Tree);
app.component('Badge',Badge);
app.component('ConfirmPopup',ConfirmPopup);
app.component('Toast',Toast);
app.component('Splitter',Splitter);
app.component('SplitterPanel',SplitterPanel);
app.component('Slider',Slider);
app.component('InputSwitch',InputSwitch);
app.component('Card',Card);
app.component('SelectButton',SelectButton);
app.component('Dropdown',Dropdown);
app.component('ToggleButton',ToggleButton);
app.component('TabPanel',TabPanel);
app.component('TabView',TabView);
app.component('Message',Message);
app.component('Listbox',Listbox);
app.component('TextArea',TextArea);

app.mount('#app');
