import Header from "./components/header";
import WorkBox from "./components/workbox";

export default function EditPage() {
  return (
    <div className="font-sans bg-gray-100 w-[100vw] h-[100vh] overflow-hidden grid">
      <div className="bg-white rounded-md m-1 overflow-hidden relative">
        <Header />
        <WorkBox />
      </div>
    </div>
  );
}
