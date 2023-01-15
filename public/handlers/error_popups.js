import { CONTAINER } from '../script'

async function errorPopUpHTML (message) {
  return `
        <div class="alert alert-danger" role="alert">
            ${JSON.stringify(message)}
        </div>
      `
}
export { errorPopUpHTML }
