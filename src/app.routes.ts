import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { Agents } from './app/features/agents/agents';
import { Models } from './app/features/models/models';
import { Datasources } from './app/features/datasources/datasources';
import { Knowledgebase } from './app/features/knowledgebase/knowledgebase';
import { Tools } from './app/features/tools/tools';
import { NewChat } from '@/features/chatbot/new-chat/new-chat';
import { OldChat } from '@/features/chatbot/old-chat/old-chat';
import { DocumentEditor } from '@/features/doc/editor/editor';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: '', component: Dashboard },
            { path: 'chat', component: NewChat },
            { path: 'chat/:id', component: OldChat },
            { path: 'doc', component: DocumentEditor },
            { path: 'agents-management', component: Agents },
            { path: 'models-management', component: Models },
            { path: 'datasources-management', component: Datasources },
            { path: 'knowledgebase-management', component: Knowledgebase },
            { path: 'tools-management', component: Tools },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
        ]
    },
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
