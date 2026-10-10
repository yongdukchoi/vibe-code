import { useEffect, useState } from 'react'
import * as svc from '../service/lottoService'

export function useLottoStore() {
  const [items, setItems] = useState(() => svc.loadItems())

  useEffect(() => {
    svc.saveItems(items)
  }, [items])

  return {
    items,
    add: (nums, imp) => setItems((p) => svc.addItem(p, nums, imp)),
    update: (id, nums, imp) => setItems((p) => svc.updateItem(p, id, nums, imp)),
    complete: (id) => setItems((p) => svc.completeItem(p, id)),
    cancel: (id) => setItems((p) => svc.cancelItem(p, id)),
    remove: (id) => setItems((p) => svc.removeItem(p, id)),
  }
}
