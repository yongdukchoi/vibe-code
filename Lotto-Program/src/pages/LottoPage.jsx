import { useState } from 'react'
import NumberForm from '../comp/NumberForm'
import NumberList from '../comp/NumberList'
import Recommend from '../comp/Recommend'
import { useLottoStore } from '../stores/lottoStore'

export default function LottoPage() {
  const store = useLottoStore()
  const [editing, setEditing] = useState(null)
  const [preset, setPreset] = useState(null)

  const submit = (nums, imp) => {
    if (editing) {
      store.update(editing.id, nums, imp)
      setEditing(null)
    } else {
      store.add(nums, imp)
    }
  }

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-10">
      <h1 className="text-5xl font-black tracking-tight">LOTTO-PROGRAM</h1>
      <NumberForm
        editing={editing}
        preset={preset}
        onSubmit={submit}
        onCancelEdit={() => setEditing(null)}
      />
      <Recommend onUse={(nums) => { setEditing(null); setPreset([...nums]) }} />
      <NumberList
        items={store.items}
        onEdit={(it) => { setEditing(it); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
        onComplete={store.complete}
        onCancel={store.cancel}
        onRemove={(id) => { if (confirm('삭제할까요?')) store.remove(id) }}
      />
    </main>
  )
}
