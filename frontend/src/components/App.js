import Header from "./Header";
import Main from "./Main";
import PopupWithForm from "./PopupWithForm";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ImagePopup from "./ImagePopup";
import { useState, useEffect } from "react";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import api from "../utils/api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import * as auth from "../utils/auth.js";
import InfoTooltip from "./InfoTooltip";

function App() {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = useState(false);
  const [statusInfoTooltip, setStatusInfoTooltip] = useState(false);
  const [infoTooltipMessage, setinfoTooltipMessage] = useState("");
  const [email, setEmail] = useState("");
  const history = useHistory();

  useEffect(() => {
    if (loggedIn) {
      api
        .getAllData()
        .then(([initialCards, userInfo]) => {
          setCurrentUser(userInfo);
          setCards(initialCards);
        })
        .catch((err) => console.log(err));
    }
  }, [loggedIn]);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      auth
        .checkToken(token)
        .then((data) => {
          if (data) {
            setLoggedIn(true);
            setEmail(data.data.email);
            history.push("/");
          }
        })
        .catch((err) => console.log(err));
    }
  }, []);

  const closeAllPopups = () => {
    setIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setSelectedCard(null);
    setIsInfoTooltipPopupOpen(false);
  };

  const handlePopupAvatarOpen = () => setIsEditAvatarPopupOpen(true);
  const handlePopupProfileOpen = () => setIsEditProfilePopupOpen(true);
  const handlePopupAddPlaceOpen = () => setIsAddPlacePopupOpen(true);

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  const handleUpdateUser = (newUserData) => {
    api
      .changeUserInfo(newUserData)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  };

  const handleUpdateAvatar = (newAvatar) => {
    api
      .changeAvatar(newAvatar)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  };

  const handleCardLike = ({ card, isLiked }) => {
    api
      .toggleLike(card._id, isLiked)
      .then((newCard) => {
        setCards((cards) => cards.map((c) => (c._id === card._id ? newCard : c)));
      })
      .catch((err) => console.log(err));
  };

  const handleCardDelete = (card) => {
    api
      .delCard(card._id)
      .then(() => {
        setCards((cards) => cards.filter((c) => c._id !== card._id));
      })
      .catch((err) => console.log(err));
  };

  const handleAddPlaceSubmit = (newCard) => {
    api
      .addCard(newCard)
      .then((data) => {
        setCards([data, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  };
  const handleRegister = (email, password) => {
    auth
      .register(email, password)
      .then((data) => {
        if (data) {
          setStatusInfoTooltip(true);
          setinfoTooltipMessage("Вы успешно зарегистрировались!");
          setIsInfoTooltipPopupOpen(true);
          history.push("/sign-in");
        }
      })
      .catch((err) => {
        console.log(err);
        setStatusInfoTooltip(false);
        setinfoTooltipMessage("Что-то пошло не так! Попробуйте ещё раз.");
        setIsInfoTooltipPopupOpen(true);
      });
  };

  const handleLogin = (email, password) => {
    auth
      .login(email, password)
      .then((data) => {
        if (data) {
          localStorage.setItem("jwt", data.token);
          setEmail(email);
          setLoggedIn(true);
          history.push("/");
        }
      })
      .catch((err) => {
        console.log(err);
        setStatusInfoTooltip(false);
        setinfoTooltipMessage("Что-то пошло не так! Попробуйте ещё раз.");
        setIsInfoTooltipPopupOpen(true);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setEmail("");
    setLoggedIn(false);
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header email={email} logOut={handleLogout} />
        <Switch>
          <ProtectedRoute
            exact
            path="/"
            loggedIn={loggedIn}
            component={Main}
            onEditAvatar={handlePopupAvatarOpen}
            onEditProfile={handlePopupProfileOpen}
            onAddPlace={handlePopupAddPlaceOpen}
            onCardClick={handleCardClick}
            cards={cards}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
          />

          <Route path="/sign-in">
            <Login handleLogin={handleLogin} />
          </Route>
          <Route path="/sign-up">
            <Register handleRegister={handleRegister} />
          </Route>
          <Route path="*">
            <Redirect to="/sign-in" />
          </Route>
        </Switch>

        <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />

        <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />

        <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit} />

        <PopupWithForm name="confirm-del" title="Вы уверены?" buttonText="Да" />

        <ImagePopup card={selectedCard} onClose={closeAllPopups} />

        <InfoTooltip
          isOpen={isInfoTooltipPopupOpen}
          onClose={closeAllPopups}
          status={statusInfoTooltip}
          message={infoTooltipMessage}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
