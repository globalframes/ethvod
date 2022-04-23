import React from 'react';
import Login from "./pages/login";
import Upload from "./pages/upload";
import Payment from "./pages/payment";
import User from "./pages/user";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import "./css/style.sass";
import "./App.css";
import { useNavigate } from "react-router-dom";



function App() {

    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/login"
                        element={(<Login />)}
                    // element={props => (<Login {...props} />)}
                    // render={props => (<Login {...props} />)}
                    />
                    <Route
                        path="/upload"
                        element={(<Upload />)}
                    // element={props => (<Login {...props} />)}
                    // render={props => (<Login {...props} />)}
                    />
                    <Route
                        path="/payment"
                        element={(<Payment />)}
                    // element={props => (<Login {...props} />)}
                    // render={props => (<Login {...props} />)}
                    />
                    <Route
                        path="/user"
                        element={(<User />)}
                    // element={props => (<Login {...props} />)}
                    // render={props => (<Login {...props} />)}
                    />

                    <Route
                        path="*"
                        element={<Navigate to="/login" replace />}
                    />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
