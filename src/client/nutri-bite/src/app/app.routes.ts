import { Routes } from '@angular/router';
import { Settings } from '@modules/settings/settings';

export const routes: Routes = [
    {
        title: "Customize your choices!",
        component: Settings,
        path: 'settings'
    }
];
