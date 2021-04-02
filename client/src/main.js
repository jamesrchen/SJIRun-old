import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

// Primevue and components
import PrimeVue from 'primevue/config';
import { PrimeIcons } from 'primevue/api';
import ToastService from 'primevue/toastservice';

import Toast from 'primevue/toast';
import Button from 'primevue/button';
import Message from 'primevue/message';

import Menubar from 'primevue/menubar';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';
import TriStateCheckbox from 'primevue/tristatecheckbox';
import SelectButton from 'primevue/selectbutton';


// Primevue CSS
import 'primevue/resources/themes/md-light-indigo/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';          

// Primeflex
import 'primeflex/primeflex.css';

const app = createApp(App);

// Global Properties
app.config.globalProperties.$appTitle = import.meta.env.VITE_APP_TITLE


// Components and Libs
app.use(PrimeVue);
app.use(ToastService);
app.component('Toast', Toast)
app.component('Button', Button)
app.component('Message', Message)
app.component('Menubar', Menubar)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('TriStateCheckbox', TriStateCheckbox)
app.component('SelectButton', SelectButton)

// Mount to index.html
app.mount("#app")


//console.log(import.meta.env)