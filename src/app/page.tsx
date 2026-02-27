'use client'

const App = () => {
  return (
    <div className="w-full p-4">
      {/* grid-cols-1 : มือถือ (1:1:1:1)
         sm:grid-cols-2 : แท็บเล็ต (2:2)
         lg:grid-cols-4 : จอคอม (4)
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        
        <div className="w-full h-[93.6px] bg-surface rounded-2xl">
          {/* ใส่ของข้างในเองเลย */}
        </div>

        <div className="w-full h-[93.6px] bg-surface rounded-2xl">
          {/* ใส่ของข้างในเองเลย */}
        </div>

        <div className="w-full h-[93.6px] bg-surface rounded-2xl">
          {/* ใส่ของข้างในเองเลย */}
        </div>

        <div className="w-full h-[93.6px] bg-surface rounded-2xl">
          {/* ใส่ของข้างในเองเลย */}
        </div>
        
      </div>
    </div>
  )
}

export default App
