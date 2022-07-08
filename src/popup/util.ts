import { groupBy, keys, sortBy } from "lodash"
import { runtime } from "webextension-polyfill"
import { AWSConfigItemState } from "../types"

export const openOptions = async () => {
  return runtime.openOptionsPage().then(window.close)
}

export const mapConfigStateToGroups = (config: AWSConfigItemState[]) => {
  const groups = groupBy(config, 'group');
  return keys(groups)
    .map((key: string) => ({
      title: key,
      children: groups[key]
    }))
    .sort((a, b) => a.title < b.title ? -1 : 1)
}