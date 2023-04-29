import {
  BrowserRouter,
  Routes,
  Route,
  HashRouter,
  MemoryRouter,
} from "react-router-dom";
import Home from "./pages/home/Home";
import LoginSuccess from "./pages/login/LoginSuccess";
import { isDev } from "./utils/constants";

function App() {
  const routes = (
    <Routes>
      {/* <Route path="/" element={<Layout />}> */}
      <Route path="/" exact element={<Home />} />
      <Route path="/login-success" element={<LoginSuccess />} />
      {/* <Route path="blogs" element={<Blogs />} />
    <Route path="contact" element={<Contact />} />
    <Route path="*" element={<NoPage />} /> */}
      {/* </Route> */}
    </Routes>
  );
  return isDev ? (
    <BrowserRouter>{routes}</BrowserRouter>
  ) : (
    <HashRouter>{routes}</HashRouter>
  );
}

export default App;
