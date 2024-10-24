import { RouterLayout } from '@renderer/components/layout/RouterLayout'

export default function History() {
  return (
    <RouterLayout>
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        <img src='https://img.dandanplay.net/anime/6107_medium.jpg'/>
        <div className="h-32 rounded-md bg-primary">111111</div>
        <div className="h-32 rounded-md bg-primary">222222</div>
        <div className="h-32 rounded-md bg-primary">333333</div>
        <div className="h-32 rounded-md bg-primary">444444</div>
        <div className="h-32 rounded-md bg-primary">555555</div>
      </div>
    </RouterLayout>
  )
}
