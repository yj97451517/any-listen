import { extensionState } from '../../../state'
import { cloneData } from './shared'

export const createMusicList = (extension: AnyListen.Extension.Extension) => {
  return {
    async getAllUserLists() {
      const data = await extensionState.remoteFuncs.getAllUserLists()
      return cloneData(data)
    },
    async getListMusics(id: string) {
      const data = await extensionState.remoteFuncs.getListMusics(id)
      return cloneData(data)
    },
    async listAction(action: AnyListen.IPCList.ActionList) {
      await extensionState.remoteFuncs.musicListAction(cloneData(action))
    },
  } as const
}
