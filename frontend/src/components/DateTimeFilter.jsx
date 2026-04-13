import React, { useState } from 'react'
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "./ui/combobox";
import { options } from "@/lib/data";

const DateTimeFilter = ({ dateQuery, setDateQuery }) => {
 const [open, setOpen] = useState(false);
  return (
    <Combobox 
      value={dateQuery}
      onValueChange={(value) => {
        setDateQuery(value);
        setOpen(false);
      }}
      open={open} 
      onOpenChange={setOpen}
    >
      <ComboboxInput placeholder="Lọc theo thời gian" value={dateQuery} />
      <ComboboxContent>
        <ComboboxList>
          {options.map((item) => (
            <ComboboxItem
              key={item.value}
              value={item.value}
            >
              {item.label}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

export default DateTimeFilter