/* eslint-disable tailwindcss/no-custom-classname */
import { cn } from '@renderer/lib/utils'
import { renderToString } from 'react-dom/server'

const SubtitlePopover = () => (
  <div className="group relative !mr-5 !mt-1 text-white">
    <input type="file" accept=".ass,.ssa" className="xgplayer-plugin-subtitle-input hidden" />
    <i
      className={cn(
        'icon-[mingcute--text-color-line]',
        'h-[32px] w-[27px] ',
        'xgplayer-plugin-subtitle-icon',
      )}
    />
    {/* <div className="absolute bottom-10 -left-20 bg-base-100 shadow-sm w-40 h-52 rounded-md hidden group-hover:block">
      <p>111111</p>
    </div> */}
  </div>
)

// export const SubtitlePopover = () => {
//   return (
//     <Popover>
//       <PopoverTrigger asChild>
//         <Button variant="outline">Open popover</Button>
//       </PopoverTrigger>
//       <PopoverContent className="w-80">
//         <div className="grid gap-4">
//           <div className="space-y-2">
//             <h4 className="font-medium leading-none">Dimensions</h4>
//             <p className="text-sm text-muted-foreground">Set the dimensions for the layer.</p>
//           </div>
//           <div className="grid gap-2">
//             <div className="grid grid-cols-3 items-center gap-4">
//               <Label htmlFor="width">Width</Label>
//               <Input id="width" defaultValue="100%" className="col-span-2 h-8" />
//             </div>
//             <div className="grid grid-cols-3 items-center gap-4">
//               <Label htmlFor="maxWidth">Max. width</Label>
//               <Input id="maxWidth" defaultValue="300px" className="col-span-2 h-8" />
//             </div>
//             <div className="grid grid-cols-3 items-center gap-4">
//               <Label htmlFor="height">Height</Label>
//               <Input id="height" defaultValue="25px" className="col-span-2 h-8" />
//             </div>
//             <div className="grid grid-cols-3 items-center gap-4">
//               <Label htmlFor="maxHeight">Max. height</Label>
//               <Input id="maxHeight" defaultValue="none" className="col-span-2 h-8" />
//             </div>
//           </div>
//         </div>
//       </PopoverContent>
//     </Popover>
//   )
// }

export const subtitlePopoverToString = renderToString(<SubtitlePopover />)
