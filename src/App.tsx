import { LazyMotion, domMax } from "framer-motion";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";

function App() {
  return (
    <>
      <LazyMotion features={domMax}>
        <RouterProvider router={router} />
      </LazyMotion>
    </>
  );
}

export default App;
