<script lang="ts">
  import { generateId } from '@/shared'
  import Item from './Item.svelte'
  import type { NotifyItem } from './shared'

  let notifys = $state.raw<NotifyItem[]>([])
  let queue: NotifyItem[] = []
  let offsets = $state<number[]>([0, 0, 0])

  export const show = (message: string, autoCloseTime = 3, selectText = false, extId = '', onafterleave?: () => void) => {
    const item = {
      id: generateId(),
      message: message.length > 2000 ? `${message.substring(0, 2000)}...` : message,
      autoCloseTime,
      selectText,
      extId,
      onafterleave() {
        onafterleave?.()
        if (queue.length) {
          notifys = [...notifys, queue.shift()!]
        }
      },
    }
    if (notifys.length > 2) {
      queue.push(item)
    } else {
      notifys = [...notifys, item]
    }
    return item.id
  }
  export const hide = (id?: string) => {
    if (!notifys.length) return
    if (id == null) {
      notifys = []
      queue = []
    } else {
      let idx = notifys.findIndex((n) => n.id == id)
      if (idx > -1) {
        notifys = notifys.toSpliced(idx, 1)
        offsets.splice(idx, 1)
        offsets.push(0)
        return
      }
      idx = queue.findIndex((n) => n.id == id)
      if (idx > -1) queue.splice(idx, 1)
    }
  }
</script>

{#if notifys.length}
  <div class="notify" role="presentation">
    {#each notifys as notify, idx (notify.id)}
      <Item
        item={notify}
        offset={offsets.slice(idx + 1).reduce((p, cur) => p + cur, 0)}
        onhide={() => {
          const idx = notifys.indexOf(notify)
          notifys = notifys.toSpliced(idx, 1)
          offsets.splice(idx, 1)
          offsets.push(0)
        }}
        onmount={(height) => {
          offsets[idx] = height + 4
        }}
      />
    {/each}
  </div>
{/if}

<style lang="less">
  .notify {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: @height-player + 20px;
    z-index: 200;
    width: 100%;
    max-width: 80%;
    // pointer-events: none;
  }

  // :global(.tips-fade-enter-active),
  // :global(.tips-fade-leave-active) {
  //   transition: opacity 0.2s;
  // }
  // :global(.tips-fade-enter),
  // :global(.tips-fade-leave-to) {
  //   opacity: 0;
  // }
</style>
