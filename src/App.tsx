import { BrowserRouter, Routes, Route } from "react-router-dom";
import Absence from "./components/absence-list";

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Absence />} />\
      </Routes>
    </BrowserRouter>
  );
}

export default App;
