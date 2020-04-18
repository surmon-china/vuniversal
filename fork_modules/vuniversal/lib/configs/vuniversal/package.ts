
import { resolveVunRoot } from '../../constants'

export default function getVunPackageJson() {
  return require(resolveVunRoot('package.json'))
}
