export default function Home() {
  return (
    <>
    <div className="flex flex-row p-2">

      <div className="basis-2/5 p-2 w-[400px] h-[300px] relative">
        <div className="w-full h-full bg-white/20 backdrop-blur-md rounded-xl border border-white/30 text-white p-6">
          <h2 className="text-xl font-bold">Channels</h2>
          <p>List of channels Component</p>
        </div>
      </div>
            <div className="basis-3/5 p-2 w-[400px]  relative">
        <div className="w-full h-full bg-white/20 backdrop-blur-md rounded-xl border border-white/30 text-white p-6">
          <h2 className="text-xl font-bold">Messages</h2>
          <p>Component of messages</p>
        </div>
      </div>
    </div>
    </>
  )
}