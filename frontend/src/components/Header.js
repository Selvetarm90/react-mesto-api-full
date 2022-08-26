import { Link, Route, Switch } from "react-router-dom";
import logo from "../images/header-logo.svg";

function Header({ email, logOut }) {
  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="Логотип Место-Россия" />

      <Switch>
        <Route path="/sign-in">
          <Link className="header__link" to="sign-up">
            Рeгистрация
          </Link>
        </Route>
        <Route path="/sign-up">
          <Link className="header__link" to="sign-in">
            Войти
          </Link>
        </Route>
        <Route exact path="/">
          <p className="header__email">
            {email}
            <Link className="header__link" onClick={logOut} to="sign-in">
              Выйти
            </Link>
          </p>
          <div className="header__burger-menu" />
        </Route>
      </Switch>
    </header>
  );
}

export default Header;
