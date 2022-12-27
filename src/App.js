import { Switch, Route, Redirect } from 'react-router';
import './App.scss';
import AdManagementPage from './DAppComponents/Pages/AdManagement/AdManagementPage';
import { AdminedRedirectPage } from './DAppComponents/Pages/CheckPages/AdminedRedirectPage';
import { AdminPage } from './DAppComponents/Pages/CheckPages/AdminPage';
import LoginPage from './DAppComponents/Pages/LoginPage';
import { LoadingScreen } from './DAppComponents/Utility/LoadingScreen';
import { useFontAwesomeLibrary } from './theme/fontawesomeSetup';

function App() {

    useFontAwesomeLibrary();

    return (
        <div className="app-root">
            <Switch>
                <Route exact path="/Login">
                    <AdminedRedirectPage to={"/AdManagement"}>
                        <LoginPage />
                    </AdminedRedirectPage>
                </Route>
                <Route exact path="/AdManagement">
                    <AdminPage>
                        <AdManagementPage />
                    </AdminPage>
                </Route>
                <Route path="/" render={props => <Redirect to="/Login" />} />
            </Switch>
            <LoadingScreen />
        </div>
    );
}

export default App;
