import { Routes } from '@angular/router';
import { Customizations } from '@modules/settings/customizations/customizations';

export const routes: Routes = [
    {
        title: "Customize your choices!",
        component: Customizations,
        path: 'settings/customizations'
    },
    {
        title: "Customize your choices!",
        path: 'settings',
        redirectTo: 'settings/customizations'
    }
];
