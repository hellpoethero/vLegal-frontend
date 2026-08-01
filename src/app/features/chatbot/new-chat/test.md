# PrimeNG Documentation

Generated: 2026-03-04
                    
```typescript
import { ApplicationConfig } from '@angular/core';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

export const appConfig: ApplicationConfig = {
    providers: [
        providePrimeNG({
            theme: {
                preset: Aura
            }
        })
    ]
};
```