import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ModalProvider, Modal } from "../context/Modal";
import { thunkRestoreUser } from "../redux/session";
import Navigation from "../components/Navigation/Navigation";

export default function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(thunkRestoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      {/* This ensures that the navigation is rendered at the top */}
      <ModalProvider>
        {isLoaded && <Navigation />}  {/* Render the navigation bar */}
        {isLoaded && <Outlet />}  {/* Render the content based on routes */}
        <Modal />  {/* If you are using modals, keep this */}
      </ModalProvider>
    </>
  );
}
