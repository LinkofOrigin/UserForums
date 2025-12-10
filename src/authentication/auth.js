import DBInstance from "../database/db";

class Authentication {

    static async attemptLogin(username, password) {
        console.log("Attempting login for user");
        const query = `SELECT id FROM users WHERE username = ? AND password = ?`;
        let bindings = [username, password];
        const loginResults = await DBInstance.query(query, bindings);
        if (loginResults.length > 0) {
            const foundId = loginResults[0].id;
            console.log(`Found user: ${foundId}`);
            return foundId;
        }
        else {
            console.log("Invalid credentials");
            return false;
        }
    }
}

export default Authentication;