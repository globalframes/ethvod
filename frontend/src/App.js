import React from 'react';
import Login from "./pages/login";
import Upload from "./pages/upload";
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";
import "./css/style.sass";
import "./App.css";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={(<Login/>)}
                        // element={props => (<Login {...props} />)}
                    // render={props => (<Login {...props} />)}
                    />
                    <Route
                        path="/upload"
                        element={(<Upload/>)}
                        // element={props => (<Login {...props} />)}
                    // render={props => (<Login {...props} />)}
                    />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
