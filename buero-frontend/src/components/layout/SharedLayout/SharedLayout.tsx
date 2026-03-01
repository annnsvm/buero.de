import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Container from "../Container/Container";

const SharedLayout = () => {
  return (
    <div >
      <Header />
      <main>
        <Container as="main">
          <Outlet />
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default SharedLayout;
