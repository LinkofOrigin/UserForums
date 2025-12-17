import DBInstance from "../database/db";
import Session from "./sessions";

class Authentication {

    static async attemptLogin(username, password) {
        console.log("Attempting login for user");
        const loginResults = await DBInstance.select('users', ['id', 'username', 'password'], { 'username': username, 'password': password });
        if (loginResults.length > 0) {
            const foundId = loginResults[0].id;
            console.log(`Found user: ${foundId}`);
            const freshSession = new Session(foundId);
            const sessionSave = await freshSession.save();
            console.log(`Created session for user with id=${foundId}`);
            return freshSession;
        }
        else {
            console.log("Invalid credentials");
            return false;
        }
    }
}

export default Authentication;