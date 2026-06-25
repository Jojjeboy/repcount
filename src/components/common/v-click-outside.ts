import type { Directive } from 'vue'

interface ClickOutsideElement extends HTMLElement {
  clickOutsideEvent?: (event: Event) => void
}

const vClickOutside: Directive = {
  mounted(el, binding) {
    const element = el as ClickOutsideElement
    element.clickOutsideEvent = (event: Event) => {
      if (!(element === event.target || element.contains(event.target as Node))) {
        if (typeof binding.value === 'function') {
          binding.value(event)
        }
      }
    }
    document.addEventListener('click', element.clickOutsideEvent!)
  },
  unmounted(el) {
    const element = el as ClickOutsideElement
    if (element.clickOutsideEvent) {
      document.removeEventListener('click', element.clickOutsideEvent)
    }
  },
}

export default vClickOutside
