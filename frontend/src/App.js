import React from 'react'
import './App.css'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom' // include yarn install and explanation for each import also mention how yarn install adds it to the dependencies
import Blog from './components/blog/Blog'
import Blogs from './components/blog/Blogs'
import Footer from './components/navigation/Footer'
import Header from './components/navigation/Header'
import Home from './components/home/Home'
// import BlogCreate from './components/home/BlogCreate'
// import BlogHome from './components/home/BlogHome'
import Login from './components/welcome/Login'
import Welcome from './components/welcome/Welcome'
import Register from './components/welcome/Register'
import AccountInfo from './components/user/AccountInfo'

const { createContext, useReducer, useEffect } = React;
export const AppContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      console.log("payload:", action.payload)
      return {
        ...state,
        isLoggedIn: true,
        token: action.payload,
        apiURL: ''
      };
        // console.log("payload:", action.payload)
    case "LOGOUT":
      return {
        ...state,
        isLoggedIn: false,
        token: '',
        apiURL: ''
      };
    default:
      return state;
  }
};

function App() {
  const cookies = document.cookie
  // console.log(cookies)
  
  const cookieToken = cookies.split("user=").pop()
  console.log(cookieToken)
  
  const initialState = {
    isLoggedIn: cookies ? true : false,
    token: cookies ? cookieToken : '',
    apiURL: ''
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  const { isLoggedIn } = state;
  // console.log(initialState.token)
  const LoginRoute = ({ component: Component, authorized, ...rest }) => (
    <Route {...rest} render={(props) => (
        authorized
            ? <Redirect to='/blog' />
            : <Component />
      )}
    />
  )

  const AuthRoute = ({ component: Component, authorized, ...rest }) => (
    <Route {...rest} render={(props) => (
        authorized
            ? <Component />
            : <Redirect to='/login' />
      )}
    />
  )

  useEffect(() => {
    // console.log("cookieToken: ", cookieToken)
    // console.log("state: ", state)
  }, [state])

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch
      }}
    >
      <Header />
      <div className="mainContainer" style={{ marginBottom: "20px" }}>
        <Router>
          <Switch>

            <Route exact path="/">
              {isLoggedIn ? <Blogs /> : <Redirect to="/welcome"/>}
            </Route>

            <Route path="/welcome">
            {isLoggedIn ? <Redirect to="/blog"/> : <Welcome/>}
            </Route>

            <LoginRoute component={Login} authorized={isLoggedIn} path="/login" />

            <AuthRoute component={Blogs} authorized={isLoggedIn} path="/blogs" />

            {/* <RegisterRoute component={Register} authorized={isLoggedIn} path="/home" /> */}

            <Route path="/blog/:id">
              <Blog />
            </Route>

            <Route path="/blog">
              <Blogs />
            </Route>

            <Route path="/register">
              <Register />
            </Route>

            <Route path="/profile">
              {isLoggedIn ? <Home /> : <Redirect to="/blog"/>}
            </Route>

            <Route path="/account">
              {isLoggedIn ? <AccountInfo /> : <Redirect to="/blog"/>}
            </Route>
            

          </Switch>
        </Router>
      </div>
      <Footer />
    </AppContext.Provider>
  );
}

export default App;
