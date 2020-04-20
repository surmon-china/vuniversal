
import { CreateAppFunction } from 'vue'
import { Router } from 'vue-router'

export type AppCreater = () => {
  app: ReturnType<CreateAppFunction<Element>>
  router: Router
}
