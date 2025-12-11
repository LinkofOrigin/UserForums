import DBInstance from "../database/db";

class Signup {

    async attemptAccountCreation(username, password) {
        if (await this.usernameExists(username)) {
            throw new Error("Unable to create account - username already exists!");
        }

        // TODO: Hash password
        const insertResults = await DBInstance.insert('users', username, password);
        return true;
    }

    async usernameExists(username) {
        const userSelectResults = await DBInstance.select('users', ['id', 'username'], { 'username': username });
        console.log(`Username check results: ${JSON.stringify(userSelectResults)}`);
        if (userSelectResults.length === 0) {
            return false;
        }
        return true;
    }
}

export default Signup;