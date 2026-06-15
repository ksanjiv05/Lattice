# services

Data-access and side-effecting logic that talks to the outside world (HTTP
clients, API calls, websockets). Keep this layer free of React — return plain
data/promises so it can be called from hooks, stores, or tests.

Example:

```ts
// userService.ts
import { http } from '@/lib/http'
import type { User } from '@/types'

export const userService = {
  getById: (id: string) => http.get<User>(`/users/${id}`),
}
```

Components never call services directly — go through a hook or store.
