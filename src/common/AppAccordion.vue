<template>
  <div class="accordion" ref="rootEl">
    <div class="accordion__head">
      <slot
        name="head"
        :accordion="{
          isOpen: isAccordionOpened,
          toggle: toggleAccordion,
          close: closeAccordion,
        }"
      />
    </div>
    <transition
      name="accordion__body-transition"
      @enter="setHeightCSSVar"
      @before-leave="setHeightCSSVar"
    >
      <div v-show="isAccordionOpened" class="accordion__body">
        <slot
          :accordion="{
            isOpen: isAccordionOpened,
            toggle: toggleAccordion,
            close: closeAccordion,
          }"
        />
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useRouter } from '@/router'

const props = withDefaults(
  defineProps<{
    isOpenedByDefault?: boolean
    isCloseByClickOutside?: boolean
  }>(),
  {
    isOpenedByDefault: false,
    isCloseByClickOutside: true,
  },
)

const rootEl = ref<HTMLElement | null>(null)
const isAccordionOpened = ref(props.isOpenedByDefault)
const router = useRouter()

router.afterEach(() => {
  closeAccordion()
})

const initAccordion = () => {
  if (rootEl.value) {
    if (props.isCloseByClickOutside) {
      onClickOutside(rootEl, () => {
        closeAccordion()
      })
    }
  }
}

const toggleAccordion = () => {
  isAccordionOpened.value = !isAccordionOpened.value
}
const closeAccordion = () => {
  isAccordionOpened.value = false
}

const setHeightCSSVar = (element: HTMLElement) => {
  element.style.setProperty(
    '--accordion-body-height',
    `${element.scrollHeight}px`,
  )
}

initAccordion()
</script>

<style lang="scss" scoped>
.accordion__body {
  overflow: hidden;
}

.accordion__body-transition-enter-active {
  animation: accordion-frame-keyframes 0.25s ease-in-out;
}

.accordion__body-transition-leave-active {
  animation: accordion-frame-keyframes 0.25s ease-in-out reverse;
}

@keyframes accordion-frame-keyframes {
  from {
    height: 0;
  }

  to {
    height: var(--accordion-body-height);
  }
}
</style>
